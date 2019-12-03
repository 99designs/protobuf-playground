import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Contents from './Contents';
import ProtoContext from './ProtoContext';
import protobuf from 'protobufjs';
import EnumContent from './EnumContent';
import MethodContent from './MethodContent';
import MessageContent from './MessageContent';
import ServiceContent from './ServiceContent';

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
  },
}));

const AppFrame = () => {
  const classes = useStyles();
  const { selected } = useContext(ProtoContext);
  useEffect(() => {
    let title = 'Protobuf Playground';
    if (selected) {
      title = `${selected.name} — ${title}`;
    }
    document.title = title;
  }, [selected]);
  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        anchor="left"
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <Contents />
      </Drawer>
      <main className={classes.content}>
        {selected instanceof protobuf.Method && (
          <MethodContent method={selected} />
        )}
        {selected instanceof protobuf.Type && (
          <MessageContent message={selected} />
        )}
        {selected instanceof protobuf.Service && (
          <ServiceContent service={selected} />
        )}
        {selected instanceof protobuf.Enum && <EnumContent enm={selected} />}
      </main>
    </div>
  );
};

export default AppFrame;
