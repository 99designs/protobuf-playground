import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import root, { namespaces, services } from './proto';
import protobuf from 'protobufjs';

const sdk = root.lookup('ninety_nine.sdk') as protobuf.Namespace;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const App = () => {
  const classes = useStyles();
  const [opens, setOpens] = useState<{ [k: string]: boolean }>({});
  const handleClick = (key: string) =>
    setOpens({ ...opens, [key]: !opens[key] });

  return (
    <div>
      <CssBaseline />
      <List className={classes.root}>
        {namespaces(sdk).map(ns => (
          <React.Fragment key={`ninety_nine.sdk.${ns.name}`}>
            <ListItem button onClick={() => handleClick(ns.name)}>
              <ListItemText primary={ns.name} />
            </ListItem>
            <Collapse in={opens[ns.name]}>
              <List>
                {services(ns).map(srv => (
                  <ListItem
                    button
                    key={`ninety_nine.sdk.${ns.name}.${srv.name}`}
                    className={classes.nested}
                  >
                    <ListItemText primary={srv.name} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default App;
