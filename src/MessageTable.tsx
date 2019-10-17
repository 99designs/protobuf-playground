import React from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import Link from './Link';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(4),
  },
  fieldHeader: {
    width: '30%',
  },
  typeHeader: {
    width: '20%',
  },
  repeated: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const MessageTable: React.FC<{ message: protobuf.Type | null }> = ({
  message,
}) => {
  const classes = useStyles();

  if (message === null) {
    return null;
  }

  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {message.fieldsArray.map(field => (
            <TableRow>
              <TableCell className={classes.fieldHeader}>
                {field.name}
              </TableCell>
              <TableCell className={classes.typeHeader}>
                {field.repeated && (
                  <>
                    <Chip label="repeated" size="small" />{' '}
                  </>
                )}
                {field.resolvedType ? (
                  <Link to={`/${field.resolvedType.fullName}`}>
                    {field.resolvedType.name}
                  </Link>
                ) : (
                  field.type
                )}
              </TableCell>
              <TableCell>{field.comment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MessageTable;
