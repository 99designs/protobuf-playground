import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import AppFrame from './AppFrame';
import root from './proto';
import ProtoContext from './ProtoContext';

const App = () => {
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
