import React from 'react';
import './App.css';
import { namespaces } from './model';

const App: React.FC = () => {
  return (
    <div className="App">
      {namespaces.map(namespace => (
        <div>
          <h1>{namespace.name}</h1>
          <h2>Services</h2>
          {namespace.services.map(({ name, methods }) => (
            <>
              <div>{name}</div>
              <ol>
                {methods.map(({ name }) => (
                  <div>{name}</div>
                ))}
              </ol>
            </>
          ))}
          <h2>Messages</h2>
          {namespace.messages.map(({ name, ...value }) => (
            <div>{name}</div>
          ))}
          <h2>Enums</h2>
          {namespace.enums.map(({ name, ...value }) => (
            <div>{name}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
