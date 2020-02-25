import React, { useContext } from 'react';
import protobuf from 'protobufjs';
import MessageTable from './MessageTable';
import ContentHeader from './ContentHeader';
import ProtoContext from './ProtoContext';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ReflectionObjectList from './ReflectionObjectList';

export default function MessageContent({
  message,
}: {
  message: protobuf.Type;
}) {
  const { getUsages } = useContext(ProtoContext);
  const usages = getUsages(message);
  return (
    <div>
      <ContentHeader object={message} />
      <MessageTable message={message} />
      {usages.length > 0 && (
        <Box my={6}>
          <Typography variant="h5" gutterBottom>
            Usages
          </Typography>
          <ReflectionObjectList items={usages} />
        </Box>
      )}
    </div>
  );
}
