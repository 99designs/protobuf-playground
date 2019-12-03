import React from 'react';
import protobuf from 'protobufjs';
import MessageTable from './MessageTable';
import ContentHeader from './ContentHeader';

const MessageContent: React.FC<{ message: protobuf.Type }> = ({ message }) => {
  return (
    <div>
      <ContentHeader object={message} />
      <MessageTable message={message} />
    </div>
  );
};

export default MessageContent;
