import React, { useContext } from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { namespaces, services, methods, parentOf } from './proto';
import ProtoContext from './ProtoContext';
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

const Namespace: React.FC<{ ns: protobuf.Namespace; depth?: number }> = ({
  ns,
  depth = 0,
}) => {
  const { selected } = useContext(ProtoContext);
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
              href={`/${srv.fullName}`}
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
  return namespaces(ns).length == 1 && services(ns).length == 0;
};

const Contents: React.FC = () => {
  const classes = useStyles();
  const { root } = useContext(ProtoContext);
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

        return (
          <List className={classes.root} dense={true} key={ns.fullName}>
            <ListSubheader>{ns.fullName}</ListSubheader>
            <Divider />
            <Namespace ns={ns as protobuf.Namespace} />
          </List>
        );
      })}
    </>
  );
};

export default Contents;
