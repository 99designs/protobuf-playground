import React, { useContext } from 'react';
import Breadcrumbs from './Breadcrumbs';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import ProtoContext from './ProtoContext';
import Search from './Search';

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
  },

  grow: {
    flexGrow: 1,
  },
}));

const AppBar: React.FC = () => {
  const { selected } = useContext(ProtoContext);
  const classes = useStyles();
  return (
    <MuiAppBar className={classes.appBar}>
      <Toolbar>
        {selected && <Breadcrumbs object={selected} />}
        <div className={classes.grow} />
        <Search />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
