import React, { useContext, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Contents from './Contents';
import ProtoContext from './ProtoContext';
import protobuf from 'protobufjs';
import EnumContent from './EnumContent';
import MethodContent from './MethodContent';
import MessageContent from './MessageContent';
import NamespaceContent from './NamespaceContent';
import ServiceContent from './ServiceContent';
import AppBar from './AppBar';
import TableOfContents from './TableOfContents';

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: theme.spacing(8),
  },
}));

const contentFor = (
  selected: protobuf.ReflectionObject | null
): React.ReactNode => {
  console.log('content for', selected);
  if (selected instanceof protobuf.Method) {
    return <MethodContent method={selected} />;
  }
  if (selected instanceof protobuf.Type) {
    return <MessageContent message={selected} />;
  }
  if (selected instanceof protobuf.Service) {
    return <ServiceContent service={selected} />;
  }
  if (selected instanceof protobuf.Enum) {
    return <EnumContent enm={selected} />;
  }
  if (selected instanceof protobuf.Namespace) {
    return <NamespaceContent namespace={selected} />;
  }
  return null;
};

const AppFrame = () => {
  const classes = useStyles();
  const { root, selected } = useContext(ProtoContext);
  useEffect(() => {
    let title = 'Protobuf Playground';
    if (selected) {
      title = `${selected.name} — ${title}`;
    }
    document.title = title;
  }, [selected]);
  const drawerContents = useMemo(
    () => <Contents root={root} selected={selected} />,
    [root, selected]
  );
  const content = useMemo(() => contentFor(selected), [selected]);
  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        anchor="left"
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        {drawerContents}
      </Drawer>
      <AppBar />
      <TableOfContents />
      <main className={classes.content}>{content}</main>
    </div>
  );
};

export default AppFrame;
