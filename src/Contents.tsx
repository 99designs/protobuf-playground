import React, { useState, useContext } from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import { namespaces, services } from './proto';
import ProtoContext from './ProtoContext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Contents = () => {
  const classes = useStyles();
  const [opens, setOpens] = useState<{ [k: string]: boolean }>({});
  const handleClick = (key: string) =>
    setOpens({ ...opens, [key]: !opens[key] });
  const { root, selected } = useContext(ProtoContext);
  const sdk = root.lookup('ninety_nine.sdk') as protobuf.Namespace;

  return (
    <List className={classes.root}>
      <ListSubheader>ninety_nine.sdk</ListSubheader>
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
                  selected={selected === srv}
                  component={props => (
                    <Link
                      to={`/ninety_nine.sdk.${ns.name}.${srv.name}`}
                      {...props}
                    />
                  )}
                >
                  <ListItemText primary={srv.name} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

export default Contents;
