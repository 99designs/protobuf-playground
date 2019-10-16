import protobuf from 'protobufjs';
import data from './proto.json';

const root = protobuf.Root.fromJSON(data);

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name);

// TODO make these set of functions work through generics <T extends protobuf.ReflectionObject>

export const namespaces = (
  namespace: protobuf.Namespace
): protobuf.Namespace[] => {
  const namespaces = namespace.nestedArray.filter(
    (o): o is protobuf.Service => o instanceof protobuf.Namespace
  );
  namespaces.sort(byName);
  return namespaces;
};

export const services = (namespace: protobuf.Namespace): protobuf.Service[] => {
  const services = namespace.nestedArray.filter(
    (o): o is protobuf.Service => o instanceof protobuf.Service
  );
  services.sort(byName);
  return services;
};

export const messages = (namespace: protobuf.Namespace): protobuf.Type[] => {
  const messages = namespace.nestedArray.filter(
    (o): o is protobuf.Type => o instanceof protobuf.Type
  );
  messages.sort(byName);
  return messages;
};

export const enums = (namespace: protobuf.Namespace): protobuf.Enum[] => {
  const enums = namespace.nestedArray.filter(
    (o): o is protobuf.Enum => o instanceof protobuf.Enum
  );
  enums.sort(byName);
  return enums;
};

export const methods = (srv: protobuf.Service): protobuf.Method[] => {
  const methods = [...srv.methodsArray];
  methods.sort(byName);
  return methods;
};

export const parentOf = (
  parent: protobuf.ReflectionObject,
  child: protobuf.ReflectionObject | null
): boolean => {
  if (child === null) {
    return false;
  }
  if (child.parent === parent) {
    return true;
  }
  if (child.parent === null || child.parent instanceof protobuf.Root) {
    return false;
  }
  return parentOf(parent, child.parent);
};

// Add global reference to window for easier debugging.
declare global {
  interface Window {
    root: protobuf.Root;
  }
}
window.root = root;

export default root;
