const protobufjs = require('protobufjs');
const fs = require('fs');

const walker = predicate => {
  const walk = (dir, files = []) => {
    fs.readdirSync(dir).forEach(file => {
      const path = dir + file;
      if (fs.statSync(path).isDirectory()) {
        walk(path + '/', files);
      } else if (predicate(path)) {
        files.push(path);
      }
    });
    return files;
  };
  return walk;
};

const protoWalk = walker(file => file.endsWith('.proto'));
const sources = protoWalk('../proto/');

const root = new protobufjs.Root();
sources.forEach(path => {
  source = fs.readFileSync(path);
  protobufjs.parse(source, root, {
    keepCase: true,
    alternateCommentMode: true, // Important so that it parses trailing comments and non-doc-blocks
  });
});

fs.writeFileSync(
  'src/proto.json',
  JSON.stringify(root.toJSON({ keepComments: true }))
);
