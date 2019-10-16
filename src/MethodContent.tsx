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

const MethodContext: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  return (
    <div>
      <Breadcrumbs>
        {heirarchy(method).map(obj => (
          <Link to={`/${obj.fullName}`} key={obj.fullName}>
            {obj.name}
          </Link>
        ))}
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

      <Typography variant="h5" gutterBottom>
        <Reply /> {method.responseType}
      </Typography>
    </div>
  );
};

export default MethodContext;
