import React, { useEffect, useState, useMemo } from 'react';
import { Route, BrowserRouter, RouteComponentProps } from 'react-router-dom';
import AppFrame from './AppFrame';
import CircularProgress from '@material-ui/core/CircularProgress';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ProtoContext from './ProtoContext';

const useStyles = makeStyles(() => ({
  messageRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20vh',
  },
}));

function InnerApp({
  match,
  root,
  title,
}: RouteComponentProps<{ object: string }> & {
  root: protobuf.Root;
  title: string;
}) {
  let selected: protobuf.ReflectionObject | null = null;
  if (match) {
    selected = root.lookup(match.params.object);
  }

  useEffect(() => {
    let newTitle = title;
    if (selected) {
      newTitle = `${selected.name} — ${newTitle}`;
    }
    document.title = newTitle;
  }, [selected, title]);

  const frame = useMemo(() => <AppFrame title={title} />, [title]);

  return (
    <ProtoContext.Provider value={{ root, selected, getUsages: () => [] }}>
      {frame}
    </ProtoContext.Provider>
  );
}

export default function App({
  jsonUrl,
  title,
}: {
  jsonUrl: string;
  title: string;
}) {
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
        <Route path="/:object" component={InnerApp} />
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
}
