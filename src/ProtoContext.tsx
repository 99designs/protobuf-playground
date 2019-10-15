import { createContext } from 'react';
import protobuf from 'protobufjs';

const ProtoContext = createContext<{
  root: protobuf.Root;
  selected: protobuf.ReflectionObject | null;
}>({
  root: new protobuf.Root(),
  selected: null,
});

export default ProtoContext;
