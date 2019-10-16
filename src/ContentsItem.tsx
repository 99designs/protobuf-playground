import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  text: {},
  selected: {
    backgroundColor: 'transparent !important',
    color: theme.palette.primary.main,
  },
  selectedText: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const ContentsItem: React.FC<{
  startOpen?: boolean;
  href?: string;
  title: string;
  children?: React.ReactNode;
  depth: number;
  classes?: any;
  selected?: boolean;
}> = props => {
  const { startOpen, href, title, children, depth, selected } = props;
  const [open, setOpen] = useState(startOpen);
  const handleClick = () => {
    setOpen(open => !open);
  };
  const style = {
    paddingLeft: 8 * (3 + 2 * depth),
  };
  const classes = useStyles(props);

  if (href) {
    return (
      <ListItem
        key={title}
        button
        component={props => <Link to={href} {...props} />}
        style={style}
        className={classes.root}
        classes={{ selected: classes.selected }}
        selected={selected}
        disableTouchRipple
      >
        <ListItemText
          primary={title}
          classes={{
            primary: clsx(classes.text, { [classes.selectedText]: selected }),
          }}
        />
      </ListItem>
    );
  }

  return (
    <>
      <ListItem
        button
        style={style}
        onClick={handleClick}
        className={classes.root}
      >
        <ListItemText primary={title} classes={{ primary: classes.text }} />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
};

export default ContentsItem;
