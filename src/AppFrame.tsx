import React, { useMemo, useContext } from 'react';
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
import ProtoContext from './ProtoContext';

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

const ContentContainer = () => {
  const { selected } = useContext(ProtoContext);
  return useMemo(() => {
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
  }, [selected]);
};

function BreadcrumbsContainer() {
  const { selected } = useContext(ProtoContext);
  return useMemo(() => (selected ? <Breadcrumbs object={selected} /> : null), [
    selected,
  ]);
}

function ContentsContainer() {
  const { root, selected } = useContext(ProtoContext);
  return useMemo(() => <Contents selected={selected} root={root} />, [
    root,
    selected,
  ]);
}

function TableOfContentsContainer() {
  const { selected } = useContext(ProtoContext);
  return useMemo(() => <TableOfContents object={selected} />, [selected]);
}

export default function AppFrame({ title }: { title: string }) {
  const classes = useStyles();
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
        <ContentsContainer />
      </Drawer>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <BreadcrumbsContainer />
          <div className={classes.grow} />
          <Search />
        </Toolbar>
      </AppBar>
      <TableOfContentsContainer />
      <main className={classes.content}>
        <ContentContainer />
      </main>
    </div>
  );
}
