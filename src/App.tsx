import React, { useEffect } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import AppFrame from './AppFrame';
import root from './proto';
import ProtoContext from './ProtoContext';

const App = () => {
  useEffect(() => {
    // Assume that the imported root is complete and will validate.
    // This resolved references to actual type objects rather than just strings.
    root.resolveAll();
  });
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
