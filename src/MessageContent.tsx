import React from 'react';
import protobuf from 'protobufjs';
import MessageTable from './MessageTable';
import ContentHeader from './ContentHeader';

export default function MessageContent({
  message,
}: {
  message: protobuf.Type;
}) {
  return (
    <div>
      <ContentHeader object={message} />
      <MessageTable message={message} />
    </div>
  );
}
