import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import AppFrame from './AppFrame';
import ProtoContext from './ProtoContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles(theme => ({
  loadingRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20vh',
  },
}));

const App: React.FC<{ jsonUrl: string }> = ({ jsonUrl }) => {
  // TODO replace all this loading logic with suspense
  const [longLoad, setLongLoad] = useState<boolean>(false);
  const [root, setRoot] = useState<protobuf.Root | null>(null);
  const classes = useStyles();
  useEffect(() => {
    console.log('setting timeout');
    const timeout = window.setTimeout(() => {
      console.log('hit timeout');
      setLongLoad(true);
    }, 2000);
    fetch(jsonUrl).then(res => {
      res.json().then(data => {
        const root = protobuf.Root.fromJSON(data);
        // Assume that the imported root is complete and will validate.
        // This resolved references to actual type objects rather than just strings.
        root.resolveAll();
        setRoot(root);
        clearTimeout(timeout);
      });
    });
  }, [jsonUrl]);
  return (
    <BrowserRouter>
      <CssBaseline />
      {root ? (
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
      ) : (
        <div className={classes.loadingRoot}>
          {longLoad && (
            <>
              <CircularProgress />
              <p>Loading protobuf data…</p>
            </>
          )}
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;
