import React from 'react';
import protobuf from 'protobufjs';
import Link from './Link';
import { heirarchy, fullName } from './proto';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

const Breadcrumbs: React.FC<{ object: protobuf.ReflectionObject }> = ({
  object,
}) => (
  <MuiBreadcrumbs color="inherit">
    {object.parent &&
      heirarchy(object.parent).map(obj => (
        <Link to={`/${fullName(obj)}`} key={obj.fullName} color="inherit">
          {obj.name}
        </Link>
      ))}
    <Typography color="inherit">{object.name}</Typography>
  </MuiBreadcrumbs>
);

export default Breadcrumbs;
