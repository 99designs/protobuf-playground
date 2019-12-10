import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from 'markdown-to-jsx';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '72em',
  },
}));

// TODO Markdown parsing is pretty slow, consider something like the `marked` package
const MarkdownBlock: React.FC<{ children?: string | null }> = ({
  children,
}) => {
  const classes = useStyles();
  return children ? (
    <div className={classes.root}>
      <Markdown options={{ forceBlock: true }}>{children}</Markdown>
    </div>
  ) : null;
};

export default MarkdownBlock;
