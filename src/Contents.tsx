import React from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { namespaces, services, parentOf, fullName } from './proto';
import ContentsItem from './ContentsItem';
import Folder from '@material-ui/icons/Folder';
import Settings from '@material-ui/icons/Settings';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  namespace: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  service: {},
}));

const Namespace: React.FC<{
  ns: protobuf.Namespace;
  depth?: number;
  selected: protobuf.ReflectionObject | null;
}> = ({ ns, depth = 0, selected }) => {
  const classes = useStyles();
  return (
    <>
      {namespaces(ns).map(ns => (
        <ContentsItem
          startOpen={parentOf(ns, selected)}
          title={ns.name}
          key={ns.fullName}
          depth={depth}
          classes={{ text: classes.namespace }}
          icon={<Folder fontSize="inherit" />}
        >
          {services(ns).map(srv => (
            <ContentsItem
              title={srv.name}
              href={`/${fullName(srv)}`}
              key={srv.fullName}
              depth={depth + 1}
              classes={{ text: classes.service }}
              icon={<Settings fontSize="inherit" />}
              selected={selected === srv}
            />
          ))}
        </ContentsItem>
      ))}
    </>
  );
};

const hasSingleChild = (ns: protobuf.Namespace): boolean => {
  return namespaces(ns).length === 1 && services(ns).length === 0;
};

const Contents: React.FC<{
  root: protobuf.Root;
  selected: protobuf.ReflectionObject | null;
}> = ({ root, selected }) => {
  const classes = useStyles();
  return (
    <>
      {root.nestedArray.map(ns => {
        if (ns instanceof protobuf.Namespace) {
          if (hasSingleChild(ns)) {
            ns = ns.nestedArray[0];
          }
        } else {
          throw Error('Protobuf root should only contain namespaces');
        }

        if (ns.fullName === '.google.protobuf') {
          return null;
        }

        return (
          <List className={classes.root} dense={true} key={ns.fullName}>
            <ListSubheader>{fullName(ns)}</ListSubheader>
            <Divider />
            <Namespace ns={ns as protobuf.Namespace} selected={selected} />
          </List>
        );
      })}
    </>
  );
};

export default Contents;
