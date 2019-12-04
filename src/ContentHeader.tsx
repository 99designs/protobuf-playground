import React from 'react';
import protobuf from 'protobufjs';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { typeName } from './proto';
import { makeStyles } from '@material-ui/core/styles';
import MarkdownBlock from './MarkdownBlock';

const useStyles = makeStyles(theme => ({
  type: {
    fontSize: '0.5em',
    paddingLeft: theme.spacing(2),
    color: theme.palette.grey[500],
  },
}));

const ContentHeader: React.FC<{
  object: protobuf.ReflectionObject;
}> = ({ object }) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h4">
        {object.name}
        <span className={classes.type}>{typeName(object)}</span>
      </Typography>
      <MarkdownBlock>{object.comment}</MarkdownBlock>
      <Box m={6} />
    </>
  );
};

export default ContentHeader;
