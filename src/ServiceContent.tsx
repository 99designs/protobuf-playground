import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { methods } from './proto';
import MessageTable from './MessageTable';
import { makeStyles } from '@material-ui/core/styles';
import MarkdownBlock from './MarkdownBlock';
import ContentHeader from './ContentHeader';

const useStyles = makeStyles(theme => ({
  root: {},
  methodName: {
    position: 'relative',
  },
  anchorLink: {
    marginTop: theme.spacing(-12), // Offset for the anchor.
    position: 'absolute',
  },
}));

const ServiceContent: React.FC<{ service: protobuf.Service }> = ({
  service,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ContentHeader object={service} />

      {methods(service).map(method => (
        <div key={method.fullName}>
          <Typography variant="h5" gutterBottom className={classes.methodName}>
            <a
              href={`#${method.name}`}
              id={method.name}
              className={classes.anchorLink}
            />
            {method.name}
          </Typography>

          <MarkdownBlock>{method.comment}</MarkdownBlock>

          {method.resolvedRequestType && (
            <MessageTable message={method.resolvedRequestType} type="request" />
          )}
          <Box m={2} />
          {method.resolvedResponseType && (
            <MessageTable
              message={method.resolvedResponseType}
              type="response"
            />
          )}

          <Box m={6} />
        </div>
      ))}
    </div>
  );
};

export default ServiceContent;
