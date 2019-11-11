import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  root: {
    top: 70,
    width: 200,
    position: 'sticky',
    order: 2,
    flexShrink: 0,
    paddingLeft: theme.spacing(4),
    height: 'calc(100vh - 70px)',
  },
  ul: {
    padding: 0,
    margin: 0,
    listStyleType: 'none',
  },
}));

// TODO support nested?
export interface TocItem {
  title: string;
  hash: string;
}

const TableOfContents: React.FC<{ items: TocItem[] }> = ({ items }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography gutterBottom>Contents</Typography>
      <Typography component="ul" className={classes.ul}>
        {items.map(item => (
          <li key={item.title}>
            <Link href={`#${item.hash}`}>{item.title}</Link>
          </li>
        ))}
      </Typography>
    </div>
  );
};

export default TableOfContents;
