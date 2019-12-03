import React, { useState } from 'react';
import protobuf from 'protobufjs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Forward from '@material-ui/icons/Forward';
import Reply from '@material-ui/icons/Reply';
import MessageTable from './MessageTable';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Playground from './Playground';
import ContentHeader from './ContentHeader';

const MethodContent: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  const [tab, setTab] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  return (
    <div>
      <ContentHeader object={method} />

      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Description" />
        <Tab label="Playground" />
      </Tabs>
      <Divider />

      {tab === 0 && (
        <>
          <Box m={2} />

          <Typography variant="h6" gutterBottom>
            <Forward fontSize="inherit" /> {method.requestType}
          </Typography>
          {method.resolvedRequestType && (
            <MessageTable message={method.resolvedRequestType} />
          )}

          <Typography variant="h6" gutterBottom>
            <Reply fontSize="inherit" /> {method.responseType}
          </Typography>
          {method.resolvedResponseType && (
            <MessageTable message={method.resolvedResponseType} />
          )}
        </>
      )}
      {tab === 1 && (
        <>
          <Playground method={method} />
        </>
      )}
    </div>
  );
};

export default MethodContent;
