import React from 'react';
import protobuf from 'protobufjs';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Forward from '@material-ui/icons/Forward';
import Reply from '@material-ui/icons/Reply';
import MessageTable from './MessageTable';
import Breadcrumbs from './Breadcrumbs';

const MethodContent: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  return (
    <div>
      <Breadcrumbs object={method} />

      <Box m={4} />

      <Typography variant="h3" gutterBottom>
        {method.name}
      </Typography>

      <Divider />
      <Box m={2} />

      <Typography variant="h5" gutterBottom>
        <Forward /> {method.requestType}
      </Typography>
      {method.resolvedRequestType && (
        <MessageTable message={method.resolvedRequestType} />
      )}

      <Typography variant="h5" gutterBottom>
        <Reply /> {method.responseType}
      </Typography>
      {method.resolvedResponseType && (
        <MessageTable message={method.resolvedResponseType} />
      )}
    </div>
  );
};

export default MethodContent;
