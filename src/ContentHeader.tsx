import React from 'react';
import protobuf from 'protobufjs';
import Breadcrumbs from './Breadcrumbs';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Markdown from 'markdown-to-jsx';
import { typeName } from './proto';
import { makeStyles } from '@material-ui/core/styles';

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
      <Breadcrumbs object={object} />
      <Box m={4} />
      <Typography variant="h4">
        {object.name}
        <span className={classes.type}>{typeName(object)}</span>
      </Typography>
      {object.comment && (
        <Markdown options={{ forceBlock: true }}>{object.comment}</Markdown>
      )}
      <Box m={6} />
    </>
  );
};

export default ContentHeader;
