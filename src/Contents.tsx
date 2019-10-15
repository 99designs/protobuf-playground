import React, { useState, useContext } from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import { namespaces, services, methods } from './proto';
import ProtoContext from './ProtoContext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  namespace: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  service: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const ContentsItem: React.FC<{
  startOpen: boolean;
  href?: string;
  title: string;
  children?: React.ReactNode;
  depth: number;
  classes?: { [k: string]: string };
}> = ({ startOpen, href, title, children, depth, classes }) => {
  const [open, setOpen] = useState(startOpen);
  const handleClick = () => {
    setOpen(open => !open);
  };

  const style = {
    paddingLeft: 8 * (3 + 2 * depth),
  };

  if (href) {
    return (
      <ListItem
        key={title}
        button
        component={props => <Link to={href} {...props} />}
        style={style}
      >
        <ListItemText primary={title} classes={classes} />
      </ListItem>
    );
  }

  return (
    <>
      <ListItem button style={style} onClick={handleClick}>
        <ListItemText primary={title} classes={classes} />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
};

const Namespace: React.FC<{ ns: protobuf.Namespace; depth?: number }> = ({
  ns,
  depth = 0,
}) => {
  const classes = useStyles();
  return (
    <>
      {namespaces(ns).map(ns => (
        <ContentsItem
          startOpen={false}
          title={ns.name}
          key={ns.fullName}
          depth={depth}
          classes={{ primary: classes.namespace }}
        >
          {services(ns).map(srv => (
            <ContentsItem
              startOpen={false}
              title={srv.name}
              key={srv.fullName}
              depth={depth + 1}
              classes={{ primary: classes.service }}
            >
              {methods(srv).map(method => (
                <ContentsItem
                  startOpen={false}
                  title={method.name}
                  href={`/${method.fullName}`}
                  key={method.fullName}
                  depth={depth + 2}
                />
              ))}
            </ContentsItem>
          ))}
        </ContentsItem>
      ))}
    </>
  );
};

const Contents: React.FC = () => {
  const classes = useStyles();
  const { root, selected } = useContext(ProtoContext);
  const sdk = root.lookup('ninety_nine.sdk') as protobuf.Namespace;

  return (
    <List className={classes.root} dense={true}>
      <ListSubheader>{sdk.fullName}</ListSubheader>
      <Divider />
      <Namespace ns={sdk} />
    </List>
  );
};

export default Contents;
