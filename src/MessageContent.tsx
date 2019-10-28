import React from 'react';
import protobuf from 'protobufjs';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import MessageTable from './MessageTable';
import Breadcrumbs from './Breadcrumbs';

const MessageContent: React.FC<{ message: protobuf.Type }> = ({ message }) => {
  return (
    <div>
      <Breadcrumbs object={message} />

      <Box m={4} />

      <Typography variant="h5" gutterBottom>
        {message.name}
      </Typography>

      <Divider />
      <Box m={2} />

      <MessageTable message={message} />
    </div>
  );
};

export default MessageContent;
