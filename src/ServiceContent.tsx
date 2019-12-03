import React from 'react';
import protobuf from 'protobufjs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { methods } from './proto';
import TableOfContents from './TableOfContents';
import MessageTable from './MessageTable';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from 'markdown-to-jsx';
import ContentHeader from './ContentHeader';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
  },
  messages: {},
}));

const ServiceContent: React.FC<{ service: protobuf.Service }> = ({
  service,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TableOfContents
        items={methods(service).map(method => ({
          title: method.name,
          hash: method.name,
        }))}
      />

      <div className={classes.content}>
        <ContentHeader object={service} />

        {methods(service).map(method => (
          <div key={method.fullName}>
            <Typography variant="h5" gutterBottom id={method.name}>
              {method.name}
            </Typography>

            {method.comment && (
              <Markdown options={{ forceBlock: true }}>
                {method.comment}
              </Markdown>
            )}

            <div className={classes.messages}>
              {method.resolvedRequestType && (
                <MessageTable
                  message={method.resolvedRequestType}
                  type="request"
                />
              )}
              <Box m={2} />
              {method.resolvedResponseType && (
                <MessageTable
                  message={method.resolvedResponseType}
                  type="response"
                />
              )}
            </div>

            <Box m={6} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceContent;
