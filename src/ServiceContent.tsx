import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { methods } from './proto';
import MessageTable from './MessageTable';
import { makeStyles } from '@material-ui/core/styles';
import MarkdownBlock from './MarkdownBlock';
import ContentHeader from './ContentHeader';
import TwirpCurlButton from './TwirpCurlButton';

const useStyles = makeStyles(theme => ({
  root: {},
  methodName: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  anchorLink: {
    marginTop: theme.spacing(-12), // Offset for the anchor.
    position: 'absolute',
  },
}));

export default function ServiceContent({
  service,
}: {
  service: protobuf.Service;
}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ContentHeader object={service} />

      {methods(service).map(method => (
        <div key={method.fullName}>
          <div className={classes.methodName}>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.methodName}
            >
              <a
                href={`#${method.name}`}
                id={method.name}
                className={classes.anchorLink}
              />
              {method.name}
            </Typography>
            <TwirpCurlButton method={method} />
          </div>

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
}
