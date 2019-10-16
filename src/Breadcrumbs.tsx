import React from 'react';
import protobuf from 'protobufjs';
import Link from './Link';
import { heirarchy } from './proto';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

const Breadcrumbs: React.FC<{ object: protobuf.ReflectionObject }> = ({
  object,
}) => (
  <MuiBreadcrumbs>
    {object.parent &&
      heirarchy(object.parent).map(obj => (
        <Link to={`/${obj.fullName}`} key={obj.fullName} color="inherit">
          {obj.name}
        </Link>
      ))}
    <Typography color="textPrimary">{object.name}</Typography>
  </MuiBreadcrumbs>
);

export default Breadcrumbs;
