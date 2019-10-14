import data from './proto.json';

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name);

const parseProtoData = (d: typeof data): Namespace[] => {
  const nested = d.nested.ninety_nine.nested.sdk.nested;

  const namespaces = Object.entries(nested).map(([name, { nested }]) => {
    const namespace: Namespace = {
      name,
      services: [],
      messages: [],
      enums: [],
    };

    Object.entries(nested).forEach(([name, value]) => {
      if (value.hasOwnProperty('methods')) {
        // Service
        const service: Service = {
          name,
          methods: Object.entries(value.methods as Method[]).map(
            ([name, data]) => ({
              name,
              ...data,
            })
          ),
        };
        service.methods.sort(byName);
        namespace.services.push(service);
      } else if (value.hasOwnProperty('fields')) {
        // Message
        namespace.messages.push({ name, ...value });
      } else if (value.hasOwnProperty('values')) {
        // Enum
        namespace.enums.push({ name, ...value });
      } else {
        // Other?
        console.error('could not determine type of protobuf object', value);
      }
    });

    // Alphabetically sort results
    namespace.services.sort(byName);
    namespace.messages.sort(byName);
    namespace.enums.sort(byName);

    return namespace;
  });

  namespaces.sort(byName);

  return namespaces;
};

export const namespaces = parseProtoData(data);

interface Namespace {
  name: string;
  services: Service[];
  messages: any[];
  enums: any[];
}

interface Service {
  name: string;
  methods: Method[];
}

interface Method {
  name: string;
  requestType: string;
  responseType: string;
  comment: string;
}

interface Message {}

interface Field {}
