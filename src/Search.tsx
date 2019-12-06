import React, { useContext, useMemo, useState, useRef } from 'react';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ProtoContext from './ProtoContext';
import Fuse from 'fuse.js';
import { flatten, typeName } from './proto';
import protobuf from 'protobufjs';
import SearchInput from './SearchInput';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  resultsPaper: {
    width: 400,
  },
  resultsList: {
    marginTop: theme.spacing(1),
    padding: `${theme.spacing(1)}px 0`,
    listStyle: 'none',
  },
  resultRoot: {
    margin: 0,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    cursor: 'pointer',
  },
  resultSelected: {
    backgroundColor: theme.palette.action.selected,
  },
  resultName: {
    fontSize: 16,
  },
  resultType: {
    fontSize: '0.8em',
    paddingLeft: theme.spacing(1),
    color: theme.palette.grey[800],
  },
  resultFullName: {
    fontSize: 12,
    color: theme.palette.grey[600],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const Search: React.FC = () => {
  const classes = useStyles();
  const { root } = useContext(ProtoContext);
  const fuse = useMemo(() => {
    const input = flatten(root);
    return new Fuse(input, { keys: ['name'], threshold: 0.4 });
  }, [root]);
  const [results, setResults] = useState<protobuf.ReflectionObject[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const inputEl = useRef<HTMLDivElement>(null);
  return (
    <>
      <SearchInput
        onChange={event =>
          setResults(fuse.search(event.target.value).slice(0, 10))
        }
        onFocus={event =>
          setResults(fuse.search(event.target.value).slice(0, 10))
        }
        onKeyDown={event => {
          switch (event.key) {
            case 'ArrowDown':
              event.preventDefault();
              if (selected === null) {
                setSelected(0);
              } else {
                setSelected((selected + 1) % results.length);
              }
              break;
            case 'ArrowUp':
              event.preventDefault();
              if (selected === null) {
                setSelected(0);
              } else {
                setSelected(selected === 0 ? results.length - 1 : selected - 1);
              }
              break;
          }
        }}
        ref={inputEl}
      />
      <Popper
        open={results.length > 0}
        anchorEl={inputEl.current}
        placement="bottom-end"
        disablePortal
      >
        <Paper className={classes.resultsPaper}>
          <ul className={classes.resultsList}>
            {results.map((result, i) => (
              <li
                className={clsx(classes.resultRoot, {
                  [classes.resultSelected]: selected === i,
                })}
                key={result.fullName}
              >
                <div className={classes.resultName}>
                  {result.name}
                  <span className={classes.resultType}>{typeName(result)}</span>
                </div>
                <div className={classes.resultFullName}>{result.fullName}</div>
              </li>
            ))}
          </ul>
        </Paper>
      </Popper>
    </>
  );
};

export default Search;
