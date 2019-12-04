import React, { useContext, useMemo } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import ProtoContext from './ProtoContext';
import Fuse from 'fuse.js';
import { flatten } from './proto';

const useStyles = makeStyles(theme => ({
  root: {
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
  icon: {
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
}));

const SearchInput: React.FC<{
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}> = ({ onChange }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.icon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        onChange={onChange}
      />
    </div>
  );
};

const Search: React.FC = () => {
  const { root } = useContext(ProtoContext);
  const fuse = useMemo(() => {
    const input = flatten(root);
    return new Fuse(input, { keys: ['name', 'fullName'] });
  }, [root]);
  return (
    <SearchInput
      onChange={event => {
        const results = fuse.search(event.target.value);
        console.log(results);
      }}
    />
  );
};

export default Search;
