import React from 'react';
import './App.css';

import data from './proto.json';
import protobuf from 'protobufjs';

const root = protobuf.Root.fromJSON(data);
const sdk = root.lookup('ninety_nine.sdk') as protobuf.Namespace;
console.log(sdk.lookup('EmptyBrief'));

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name);

const services = (namespace: protobuf.Namespace): protobuf.Service[] => {
  const services = namespace.nestedArray.filter(
    (o): o is protobuf.Service => o instanceof protobuf.Service
  );
  services.sort(byName);
  return services;
};

const messages = (namespace: protobuf.Namespace): protobuf.Type[] => {
  const messages = namespace.nestedArray.filter(
    (o): o is protobuf.Type => o instanceof protobuf.Type
  );
  messages.sort(byName);
  return messages;
};

const enums = (namespace: protobuf.Namespace): protobuf.Enum[] => {
  const enums = namespace.nestedArray.filter(
    (o): o is protobuf.Enum => o instanceof protobuf.Enum
  );
  enums.sort(byName);
  return enums;
};

const App: React.FC = () => {
  return (
    <div className="App">
      {sdk &&
        sdk.nestedArray.map(namespace => (
          <div key={`ninety_nine.sdk.${namespace.name}`}>
            <h1>{namespace.name}</h1>
            <h2>Services</h2>
            {services(namespace as protobuf.Namespace).map(
              ({ name, methods }) => (
                <div>
                  <div>
                    {name} {}
                  </div>
                  <ol>
                    {Object.keys(methods).map(name => (
                      <div>{name}</div>
                    ))}
                  </ol>
                </div>
              )
            )}
            <h2>Messages</h2>
            {messages(namespace as protobuf.Namespace).map(
              ({ name, ...value }) => (
                <div>{name}</div>
              )
            )}
            <h2>Enums</h2>
            {enums(namespace as protobuf.Namespace).map(
              ({ name, ...value }) => (
                <div>{name}</div>
              )
            )}
          </div>
        ))}
    </div>
  );
};

export default App;
