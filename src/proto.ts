import protobuf, { ReflectionObject } from 'protobufjs';

// Utility functions for working with protobufjs objects.  Mostly covering gaps in their
// API for our common use-cases.

function byName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name);
}

// TODO make these set of functions work through generics <T extends protobuf.ReflectionObject>

export function namespaces(namespace: protobuf.Namespace) {
  const namespaces = namespace.nestedArray.filter(
    (o): o is protobuf.Service => o instanceof protobuf.Namespace
  );
  namespaces.sort(byName);
  return namespaces;
}

export function services(namespace: protobuf.Namespace) {
  const services = namespace.nestedArray.filter(
    (o): o is protobuf.Service => o instanceof protobuf.Service
  );
  services.sort(byName);
  return services;
}

export function messages(namespace: protobuf.Namespace) {
  const messages = namespace.nestedArray.filter(
    (o): o is protobuf.Type => o instanceof protobuf.Type
  );
  messages.sort(byName);
  return messages;
}

export function enums(namespace: protobuf.Namespace) {
  const enums = namespace.nestedArray.filter(
    (o): o is protobuf.Enum => o instanceof protobuf.Enum
  );
  enums.sort(byName);
  return enums;
}

export function methods(srv: protobuf.Service) {
  const methods = [...srv.methodsArray];
  methods.sort(byName);
  return methods;
}

export function parentOf(
  parent: protobuf.ReflectionObject,
  child: protobuf.ReflectionObject | null
) {
  return child ? heirarchy(child).includes(parent) : false;
}

export function heirarchy(
  obj: protobuf.ReflectionObject
): protobuf.ReflectionObject[] {
  return obj.parent === null || obj.parent instanceof protobuf.Root
    ? [obj]
    : [...heirarchy(obj.parent), obj];
}

// Produces a JSON object that is a template for a given message.
export function jsonTemplate(message: protobuf.Type): any {
  const tmpl: any = {};
  message.fieldsArray.forEach(field => {
    // TODO better handling of repeated template - should probably fill out 1 value.
    if (field.repeated) {
      tmpl[field.name] = [];
      return;
    }
    if (
      field.resolvedType !== null &&
      field.resolvedType instanceof protobuf.Type
    ) {
      tmpl[field.name] = jsonTemplate(field.resolvedType);
      return;
    }
    switch (field.type) {
      case 'int32':
      case 'int64':
      case 'float':
        tmpl[field.name] = 0;
        break;
      case 'string':
        tmpl[field.name] = '';
        break;
      default:
        console.error('unknown type:', field.type);
        break;
    }
  });
  return tmpl;
}

// Returns obj.fullName without the first period.
export function fullName(obj: protobuf.ReflectionObject) {
  return obj.fullName[0] === '.' ? obj.fullName.substr(1) : obj.fullName;
}

export const typeName = (obj: protobuf.ReflectionObject): string => {
  if (obj instanceof protobuf.Service) {
    return 'Service';
  }
  if (obj instanceof protobuf.Method) {
    return 'Method';
  }
  if (obj instanceof protobuf.Type) {
    return 'Message';
  }
  if (obj instanceof protobuf.Enum) {
    return 'Enum';
  }
  if (obj instanceof protobuf.Namespace) {
    return 'Namespace';
  }
  return '';
};

// Returns a sorted list of enum values as tuples ordered by id
export function valuesByID(enm: protobuf.Enum) {
  return Object.keys(enm.values)
    .map(value => ({ id: enm.values[value], value }))
    .sort((a, b) => a.id - b.id);
}

// Reducer to flatten out array of proto objects.
function _flatten(
  arr: protobuf.ReflectionObject[],
  obj: protobuf.ReflectionObject
) {
  if (!(obj instanceof protobuf.Root)) {
    arr.push(obj);
  }
  if (obj instanceof protobuf.Namespace) {
    obj.nestedArray.reduce(_flatten, arr);
  }
  if (obj instanceof protobuf.Service) {
    obj.methodsArray.reduce(_flatten, arr);
  }
  return arr;
}

export function flatten(obj: protobuf.Namespace) {
  return _flatten([], obj);
}

// Builds an index of objects mapped to an array of objects that reference them.
export function buildUsageIndex(root: protobuf.Root) {
  const index: { [k: string]: protobuf.ReflectionObject[] } = {};
  flatten(root).forEach(obj => {
    const add = (k: protobuf.ReflectionObject) => {
      k.fullName in index || (index[k.fullName] = []);
      if (!index[k.fullName].includes(obj)) {
        index[k.fullName].push(obj);
      }
    };

    if (obj instanceof protobuf.Service) {
      obj.methodsArray.forEach(method => add(method));
      obj.nestedArray.forEach(nested => add(nested));
    }
    if (obj instanceof protobuf.Method) {
      add(obj.resolvedRequestType!);
      add(obj.resolvedResponseType!);
    }
    if (obj instanceof protobuf.Type) {
      obj.fieldsArray.forEach(field => {
        if (field.resolvedType) {
          add(field.resolvedType);
        }
      });
    }
  });
  return index;
}
