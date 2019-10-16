import React from 'react';
import protobuf from 'protobufjs';
import { heirarchy } from './proto';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Forward from '@material-ui/icons/Forward';
import Reply from '@material-ui/icons/Reply';
import Link from './Link';
import MessageTable from './MessageTable';

const MethodContext: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  return (
    <div>
      <Breadcrumbs>
        {method.parent &&
          heirarchy(method.parent).map(obj => (
            <Link to={`/${obj.fullName}`} key={obj.fullName} color="inherit">
              {obj.name}
            </Link>
          ))}
        <Typography color="textPrimary">{method.name}</Typography>
      </Breadcrumbs>

      <Box m={4} />

      <Typography variant="h3" gutterBottom>
        {method.name}
      </Typography>

      <Divider />
      <Box m={2} />

      <Typography variant="h5" gutterBottom>
        <Forward /> {method.requestType}
      </Typography>
      <MessageTable message={method.resolvedRequestType} />

      <Typography variant="h5" gutterBottom>
        <Reply /> {method.responseType}
      </Typography>
      <MessageTable message={method.resolvedResponseType} />
    </div>
  );
};

export default MethodContext;
