import React, { useState } from 'react';
import protobuf from 'protobufjs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Forward from '@material-ui/icons/Forward';
import Reply from '@material-ui/icons/Reply';
import MessageTable from './MessageTable';
import Breadcrumbs from './Breadcrumbs';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Playground from './Playground';
import Markdown from 'markdown-to-jsx';

const MethodContent: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  const [tab, setTab] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  return (
    <div>
      <Breadcrumbs object={method} />

      <Box m={4} />

      <Typography variant="h5" gutterBottom>
        {method.name}
      </Typography>

      {method.comment && <Markdown>{method.comment}</Markdown>}

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
