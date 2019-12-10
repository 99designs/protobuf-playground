import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import AppFrame from './AppFrame';
import CircularProgress from '@material-ui/core/CircularProgress';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles(theme => ({
  messageRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20vh',
  },
}));

const App: React.FC<{ jsonUrl: string }> = ({ jsonUrl }) => {
  // TODO replace all this loading logic with suspense
  const [loadState, setLoadState] = useState<
    'loading' | 'longLoading' | 'error' | 'done'
  >('loading');
  const [root, setRoot] = useState<protobuf.Root | null>(null);
  const classes = useStyles();
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoadState('longLoading');
    }, 2000);
    const error = () => {
      clearTimeout(timeout);
      setLoadState('error');
    };
    fetch(jsonUrl)
      .then(res => {
        if (res.status === 200) {
          res
            .json()
            .then(data => {
              const root = protobuf.Root.fromJSON(data);
              // Assume that the imported root is complete and will validate.
              // This resolved references to actual type objects rather than just strings.
              root.resolveAll();
              setRoot(root);
              clearTimeout(timeout);
              setLoadState('done');
            })
            .catch(error);
        } else {
          error();
        }
      })
      .catch(error);
  }, [jsonUrl]);
  return (
    <BrowserRouter>
      <CssBaseline />
      {loadState === 'done' && root && (
        <Route path="/:object">
          {({ match }) => {
            let selected = null;
            if (match) {
              selected = root.lookup(match.params.object);
            }
            return <AppFrame root={root} selected={selected} />;
          }}
        </Route>
      )}
      {loadState === 'longLoading' && (
        <div className={classes.messageRoot}>
          <CircularProgress />
          <p>Loading protobuf data…</p>
        </div>
      )}
      {loadState === 'error' && (
        <div className={classes.messageRoot}>
          <p>Could not load protobuf data</p>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;
