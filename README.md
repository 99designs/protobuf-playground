# Protobuf Playground

Protobuf Playground is a docsite and IDE for your protobuf definitions to enable better protobuf development workflows.

## Setup

Clone the repository, do an npm install then run the generate command against your protobuf directory.

```
npm install
npm run generate [path to protobuf file root]
```

All protobuf file paths are resolved relative to the root path given.  Protobuf definitions must be complete in order to
successfully generate the JSON output.  Output will be saved as `public/proto.json`.

```
npm start
```

You should now have the playground up and running.
