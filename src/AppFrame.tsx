import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Contents from './Contents';
import ProtoContext from './ProtoContext';
import protobuf from 'protobufjs';
import MethodContent from './MethodContent';

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
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        anchor="left"
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <Contents />
      </Drawer>
      <main className={classes.content}>
        {selected && selected instanceof protobuf.Method && (
          <MethodContent method={selected} />
        )}
      </main>
    </div>
  );
};

export default AppFrame;
