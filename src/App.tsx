import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import AppFrame from './AppFrame';
import root from './proto';
import ProtoContext from './ProtoContext';

const App = () => {
  const [, setResolved] = useState(false);
  useEffect(() => {
    // Assume that the imported root is complete and will validate.
    // This resolved references to actual type objects rather than just strings.
    root.resolveAll();
    setResolved(true);
  }, []);
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
