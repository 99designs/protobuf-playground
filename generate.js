const protobufjs = require('protobufjs');
const fs = require('fs');
const request = require('request-promise');

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

const parseOptions = {
  keepCase: true,
  alternateCommentMode: true, // Important so that it parses trailing comments and non-doc-blocks
};

const root = new protobufjs.Root();

sources.forEach(path => {
  source = fs.readFileSync(path);
  protobufjs.parse(source, root, parseOptions);
  console.log('adding:', path);
});

// TODO extract these external dependencies from source files somehow
const extern = [
  'google/protobuf/field_mask.proto',
  'google/protobuf/struct.proto',
  'google/protobuf/timestamp.proto',
  'google/protobuf/wrappers.proto',
];

const requests = extern.map(path => {
  const url =
    'https://raw.githubusercontent.com/protocolbuffers/protobuf/master/src/' +
    path;
  return request(url, (error, _, source) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    protobufjs.parse(source, root, parseOptions);
    console.log('external:', path);
  });
});

Promise.all(requests).then(() => {
  fs.writeFileSync(
    'src/proto.json',
    JSON.stringify(root.toJSON({ keepComments: true }))
  );
  console.log('wrote: src/proto.json');
});
