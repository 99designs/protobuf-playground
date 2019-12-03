import React, { useState } from 'react';
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
import IconButton from '@material-ui/core/IconButton';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Markdown from 'markdown-to-jsx';
import { fullName } from './proto';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'auto',
  },
  expandHeader: {
    width: 100,
  },
  fieldHeader: {
    width: '30%',
  },
  cellNested: {
    padding: 0,
  },
  typeHeader: {
    width: '20%',
  },
  descriptionHeader: {
    width: '100%',
  },
  repeated: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  descriptionCell: {
    '& p': {
      margin: 0,
    },
    '& p + p': {
      marginTop: theme.spacing(2),
    },
  },
  title: {
    fontSize: 16,
    backgroundColor: theme.palette.grey[100],
  },
}));

const FieldRow: React.FC<{ field: protobuf.Field; depth: number }> = ({
  field,
  depth,
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const style = {
    paddingLeft: 16 * (1 + 2 * depth),
  };
  return (
    <>
      <TableRow>
        <TableCell padding="checkbox">
          {field.resolvedType && field.resolvedType instanceof protobuf.Type && (
            <IconButton size="small" onClick={() => setOpen(open => !open)}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </TableCell>
        <TableCell style={style}>{field.name}</TableCell>
        <TableCell>
          {field.resolvedType ? (
            <Link to={`/${fullName(field.resolvedType)}`}>
              {field.resolvedType.name}
            </Link>
          ) : (
            field.type
          )}
          {field.repeated && (
            <>
              {' '}
              <Chip label="repeated" size="small" />
            </>
          )}
        </TableCell>
        <TableCell className={classes.descriptionCell}>
          {field.comment && <Markdown>{field.comment}</Markdown>}
        </TableCell>
      </TableRow>
      {field.resolvedType &&
        field.resolvedType instanceof protobuf.Type &&
        open && (
          <MessageTableInner message={field.resolvedType} depth={depth + 1} />
        )}
    </>
  );
};

const MessageTableInner: React.FC<{
  message: protobuf.Type;
  depth?: number;
}> = ({ message, depth = 0 }) => {
  return (
    <>
      {message.fieldsArray.map(field => (
        <FieldRow field={field} key={`${field.fullName}`} depth={depth} />
      ))}
    </>
  );
};

const MessageTable: React.FC<{
  message: protobuf.Type;
  type?: 'request' | 'response';
}> = ({ message, type }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={4} className={classes.title}>
              {type === 'request' && <ArrowForward fontSize="inherit" />}
              {type === 'response' && <ArrowBack fontSize="inherit" />}
              {type && ' '}
              {message.name}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell className={classes.fieldHeader}>Field</TableCell>
            <TableCell className={classes.typeHeader}>Type</TableCell>
            <TableCell className={classes.descriptionHeader}>
              Description
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <MessageTableInner message={message} />
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MessageTable;
