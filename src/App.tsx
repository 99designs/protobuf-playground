import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import AppFrame from './AppFrame';
import ProtoContext from './ProtoContext';
import protobuf from 'protobufjs';

const App: React.FC<{ jsonUrl: string }> = ({ jsonUrl }) => {
  const [root, setRoot] = useState<protobuf.Root>();
  useEffect(() => {
    fetch(jsonUrl).then(res => {
      res.json().then(data => {
        const root = protobuf.Root.fromJSON(data);
        // Assume that the imported root is complete and will validate.
        // This resolved references to actual type objects rather than just strings.
        root.resolveAll();
        setRoot(root);
      });
    });
  }, []);
  return (
    <BrowserRouter>
      {root && (
        <Route path="/:object">
          {({ match }) => {
            let selected = null;
            if (match) {
              selected = root.lookup(match.params.object);
            }
            return (
              <ProtoContext.Provider value={{ root, selected }}>
                <AppFrame />
              </ProtoContext.Provider>
            );
          }}
        </Route>
      )}
    </BrowserRouter>
  );
};

export default App;
