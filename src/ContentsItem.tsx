import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import { ForwardedRouterLink as Link } from './Link';

const useStyles = makeStyles(theme => ({
  root: {
    '&$selected': {
      backgroundColor: 'transparent',
    },
  },
  text: {},
  selected: {},
  selectedText: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.primary.main,
  },
  listItemIcon: {
    minWidth: 20,
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
  icon?: React.ReactElement;
}> = props => {
  const { startOpen, href, title, children, depth, selected, icon } = props;
  const [open, setOpen] = useState(startOpen);
  const handleClick = () => {
    setOpen(open => !open);
  };
  const style = {
    paddingLeft: 8 * (2 + 2 * depth),
  };
  const classes = useStyles(props);

  if (href) {
    return (
      <ListItem
        key={title}
        button
        component={Link}
        style={style}
        className={classes.root}
        classes={{
          root: classes.root,
          selected: classes.selected,
        }}
        selected={selected}
        disableTouchRipple
        to={href}
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
        {icon && (
          <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
        )}
        <ListItemText primary={title} classes={{ primary: classes.text }} />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
};

export default ContentsItem;
