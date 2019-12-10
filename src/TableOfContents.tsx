import React, { useEffect, useCallback, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import protobuf from 'protobufjs';
import { methods } from './proto';
import clsx from 'clsx';
import throttle from 'lodash/throttle';

const useStyles = makeStyles(theme => ({
  root: {
    top: 70,
    width: 200,
    position: 'sticky',
    order: 2,
    flexShrink: 0,
    height: 'calc(100vh - 70px)',
    overflowY: 'auto',
    padding: theme.spacing(2, 2, 2, 0),
  },
  header: {
    margin: theme.spacing(0, 0, 1, 1.5),
  },
  ul: {
    padding: 0,
    margin: 0,
    listStyleType: 'none',
  },
  item: {
    fontSize: 13,
    padding: theme.spacing(0.5, 0, 0.5, 1),
    borderLeft: '4px solid transparent',
    boxSizing: 'content-box',
    color: theme.palette.grey[500],
    '&:hover': {
      color: theme.palette.primary.main,
    },
    '&$active': {
      color: theme.palette.primary.main,
      borderLeft: `4px solid ${theme.palette.grey[300]}`,
    },
  },
  active: {},
}));

const TableOfContents: React.FC<{
  object: protobuf.ReflectionObject | null;
}> = ({ object }) => {
  const classes = useStyles();

  const itemRefs = useRef<HTMLElement[]>([]);
  useEffect(() => {
    if (object instanceof protobuf.Service) {
      itemRefs.current = [];
      methods(object).forEach(method => {
        const el = document.getElementById(method.name);
        if (el !== null) {
          itemRefs.current.push(el);
        }
      });
    }
  }, [object]);

  const [activeMethod, setActiveMethod] = useState<string | null>(null);

  // Check position of elements in the page and set one to active based on scroll location.
  const findActive = useCallback(
    throttle(() => {
      if (clickedRef.current) {
        return;
      }

      let active;
      for (let i = itemRefs.current.length - 1; i >= 0; i--) {
        const item = itemRefs.current[i];
        if (
          item &&
          item.getBoundingClientRect().top <
            document.documentElement.clientHeight / 8
        ) {
          active = item.id;
          break;
        }
      }

      if (active && active !== activeMethod) {
        setActiveMethod(active);
      }
    }, 200),
    [activeMethod]
  );

  useEffect(() => {
    const callback = findActive;
    window.addEventListener('scroll', callback);

    return () => {
      window.removeEventListener('scroll', callback);
    };
  });

  const clickedRef = React.useRef<boolean>(false);
  const unsetClickedRef = React.useRef<number | null>(null);

  const handleClick = (hash: string) => () => {
    clickedRef.current = true;
    unsetClickedRef.current = window.setTimeout(() => {
      clickedRef.current = false;
    }, 1000);

    if (activeMethod !== hash) {
      setActiveMethod(hash);
    }
  };

  React.useEffect(
    () => () => {
      if (unsetClickedRef.current) {
        window.clearTimeout(unsetClickedRef.current);
      }
    },
    []
  );

  if (!(object instanceof protobuf.Service)) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.header}>Contents</Typography>
      <Typography component="ul" className={classes.ul}>
        {methods(object).map(method => (
          <li key={method.name}>
            <Link
              href={`#${method.name}`}
              className={clsx(classes.item, {
                [classes.active]: activeMethod === method.name,
              })}
              underline="none"
              onClick={handleClick(method.name)}
            >
              {method.name}
            </Link>
          </li>
        ))}
      </Typography>
    </div>
  );
};

export default TableOfContents;
