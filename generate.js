const protobufjs = require('protobufjs');
const fs = require('fs');
const path = require('@protobufjs/path');

const walk = (dir, files = []) => {
  fs.readdirSync(dir).forEach(file => {
    const path = dir + file;
    if (fs.statSync(path).isDirectory()) {
      walk(path + '/', files);
    } else if (path.endsWith('.proto')) {
      files.push(path);
    }
  });
  return files;
};

process.chdir('../proto');

const sources = walk('./');

const parseOptions = {
  keepCase: true,
  alternateCommentMode: true, // Important so that it parses trailing comments and non-doc-blocks
};

const root = new protobufjs.Root();
root.resolvePath = (origin, include) => {
  if (include.startsWith('./')) {
    include = include.substr(2);
  }

  // FIXME this will currently only handle google imports gracefully.
  if (include.startsWith('google/')) {
    console.log('📦', include);
    return path.resolve(
      origin,
      'https://raw.githubusercontent.com/protocolbuffers/protobuf/master/src/' +
        include
    );
  }

  console.log('📂', include);
  return path.resolve(origin, include);
};

root.loadSync(sources, parseOptions);

// TODO possibly consider serialising filenames alongside root JSON?
// The JSON descriptor format does not include support for filenames, so it would need to be a side channel.
// e.g. { root: JSON.stringify(root), filenames: {} }
const json = root.toJSON({ keepComments: true });
process.chdir('../playground');
fs.writeFileSync('../playground/src/proto.json', JSON.stringify(json));
console.log('💾 src/proto.json');
