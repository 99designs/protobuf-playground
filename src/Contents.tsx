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
  service: {
    fontWeight: theme.typography.fontWeightMedium,
  },
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
              startOpen={parentOf(srv, selected)}
              title={srv.name}
              key={srv.fullName}
              depth={depth + 1}
              classes={{ text: classes.service }}
              icon={<Settings fontSize="inherit" />}
            >
              {methods(srv).map(method => (
                <ContentsItem
                  title={method.name}
                  href={`/${method.fullName}`}
                  key={method.fullName}
                  depth={depth + 2}
                  selected={selected === method}
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
  const { root } = useContext(ProtoContext);
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
