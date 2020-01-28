const protobufjs = require('protobufjs');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs').option('ignore', {
  alias: 'i',
  type: 'string',
}).argv;

const ignore = typeof yargs.ignore === 'string' ? [yargs.ignore] : yargs.ignore;

let [rootPath, outFile = 'public/proto.json'] = yargs._;
if (rootPath === undefined) {
  console.info('usage: generate.js proto-path');
  process.exit(1);
}
rootPath = path.resolve(rootPath);
if (!fs.existsSync(rootPath) || !fs.statSync(rootPath).isDirectory()) {
  console.error(`${rootPath}: no such directory exists`);
  process.exit(1);
}

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
const sources = walk(rootPath + '/');

const parseOptions = {
  keepCase: true,
  alternateCommentMode: true, // Important so that it parses trailing comments and non-doc-blocks
};

const root = new protobufjs.Root();
root.resolvePath = (origin, include) => {
  for (let i = 0; i < ignore.length; i++) {
    if (include.endsWith(ignore[i])) {
      return null;
    }
  }

  if (!fs.existsSync(include)) {
    include = rootPath + '/' + include;
  }

  console.log(path.relative(rootPath, include));
  return include;
};

root.loadSync(sources, parseOptions);

try {
  root.resolveAll();
} catch (err) {
  console.error(`fatal: could not resolve root: ${err}`);
  process.exit(1);
}

// TODO possibly consider serialising filenames alongside root JSON?
// The JSON descriptor format does not include support for filenames, so it would need to be a side channel.
// e.g. { root: JSON.stringify(root), filenames: {} }
const json = root.toJSON({ keepComments: true });
fs.writeFileSync(outFile, JSON.stringify(json));
console.log('saved', outFile);
