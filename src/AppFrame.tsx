import React, { useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Contents from './Contents';
import protobuf from 'protobufjs';
import EnumContent from './EnumContent';
import MethodContent from './MethodContent';
import MessageContent from './MessageContent';
import NamespaceContent from './NamespaceContent';
import ServiceContent from './ServiceContent';
import TableOfContents from './TableOfContents';
import Breadcrumbs from './Breadcrumbs';
import Search from './Search';

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
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
  },
  grow: {
    flexGrow: 1,
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    paddingLeft: theme.spacing(2),
    display: 'flex',
    fontSize: 18,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
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

const AppFrame: React.FC<{
  root: protobuf.Root;
  selected: protobuf.ReflectionObject | null;
  title: string;
}> = ({ root, selected, title }) => {
  const classes = useStyles();
  useEffect(() => {
    let newTitle = title;
    if (selected) {
      newTitle = `${selected.name} — ${newTitle}`;
    }
    document.title = newTitle;
  }, [selected, title]);
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
        <div className={classes.drawerHeader}>
          <span>{title}</span>
        </div>
        <Divider />
        {drawerContents}
      </Drawer>
      <AppBar className={classes.appBar}>
        <Toolbar>
          {selected && <Breadcrumbs object={selected} />}
          <div className={classes.grow} />
          <Search root={root} />
        </Toolbar>
      </AppBar>
      <TableOfContents object={selected} />
      <main className={classes.content}>{content}</main>
    </div>
  );
};

export default AppFrame;
