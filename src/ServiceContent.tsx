import React from 'react';
import protobuf from 'protobufjs';
import Breadcrumbs from './Breadcrumbs';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { methods } from './proto';
import TableOfContents from './TableOfContents';
import MessageTable from './MessageTable';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from 'markdown-to-jsx';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
  },
  messages: {
    paddingLeft: theme.spacing(2),
  },
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
        <Breadcrumbs object={service} />

        <Box m={4} />

        <Typography variant="h4" gutterBottom>
          {service.name}
        </Typography>

        {service.comment && <Markdown>{service.comment}</Markdown>}

        {methods(service).map(method => (
          <div key={method.fullName}>
            <Box m={8} />

            <Typography variant="h5" gutterBottom id={method.name}>
              {method.name}
            </Typography>

            {method.comment && <Markdown>{method.comment}</Markdown>}

            <div className={classes.messages}>
              <Typography variant="h6" gutterBottom>
                {method.requestType}
              </Typography>
              {method.resolvedRequestType && (
                <MessageTable message={method.resolvedRequestType} />
              )}

              <Typography variant="h6" gutterBottom>
                {method.responseType}
              </Typography>
              {method.resolvedResponseType && (
                <MessageTable message={method.resolvedResponseType} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceContent;
