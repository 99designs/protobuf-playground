import React, { useContext } from 'react';
import Breadcrumbs from './Breadcrumbs';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import ProtoContext from './ProtoContext';

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
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
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
