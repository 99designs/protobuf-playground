import React, { useMemo, useState, useRef } from 'react';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Fuse from 'fuse.js';
import { flatten, typeName, fullName } from './proto';
import protobuf from 'protobufjs';
import SearchInput from './SearchInput';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

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
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
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

export default function Search({ root }: { root: protobuf.Root }) {
  const classes = useStyles();
  const fuse = useMemo(() => {
    const input = flatten(root);
    return new Fuse(input, { keys: ['name'], threshold: 0.4 });
  }, [root]);
  const [results, setResults] = useState<protobuf.ReflectionObject[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const inputEl = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const goto = (result: protobuf.ReflectionObject) => {
    history.push(`/${fullName(result)}`);
    inputEl.current && inputEl.current.blur();
  };
  return (
    <>
      <SearchInput
        onChange={event =>
          setResults(fuse.search(event.target.value).slice(0, 10))
        }
        onFocus={event =>
          setResults(fuse.search(event.target.value).slice(0, 10))
        }
        onBlur={() => {
          setResults([]);
          setSelected(null);
        }}
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
            case 'Enter':
              if (selected !== null) {
                event.preventDefault();
                goto(results[selected]);
              }
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
                onMouseDown={() => goto(result)}
              >
                <div className={classes.resultName}>
                  {result.name}
                  <span className={classes.resultType}>{typeName(result)}</span>
                </div>
                <div className={classes.resultFullName}>{fullName(result)}</div>
              </li>
            ))}
          </ul>
        </Paper>
      </Popper>
    </>
  );
}
