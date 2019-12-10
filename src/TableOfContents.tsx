import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import protobuf from 'protobufjs';
import { methods } from './proto';

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
  ul: {
    padding: 0,
    margin: 0,
    listStyleType: 'none',
  },
  item: {
    fontSize: 13,
    color: theme.palette.grey[500],
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

// TODO support nested?
export interface TocItem {
  title: string;
  hash: string;
}

const TableOfContents: React.FC<{
  selected: protobuf.ReflectionObject | null;
}> = ({ selected }) => {
  const classes = useStyles();

  if (!(selected instanceof protobuf.Service)) {
    return null;
  }

  const items: TocItem[] = methods(selected).map(method => ({
    title: method.name,
    hash: method.name,
  }));

  return (
    <div className={classes.root}>
      <Typography gutterBottom>Contents</Typography>
      <Typography component="ul" className={classes.ul}>
        {items.map(item => (
          <li key={item.title}>
            <Link
              href={`#${item.hash}`}
              className={classes.item}
              underline="none"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </Typography>
    </div>
  );
};

export default TableOfContents;
