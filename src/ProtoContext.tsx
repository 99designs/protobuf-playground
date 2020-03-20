import { createContext } from 'react';
import protobuf from 'protobufjs';

export default createContext<{
  root: protobuf.Root;
  selected: protobuf.ReflectionObject | null;
  getUsages: (obj: protobuf.ReflectionObject) => protobuf.ReflectionObject[];
  twirpBaseUrl: string;
}>({
  root: new protobuf.Root(),
  selected: null,
  getUsages: () => [],
  twirpBaseUrl: '',
});
