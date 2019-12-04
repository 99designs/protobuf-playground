import React from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import ContentHeader from './ContentHeader';
import { valuesByID } from './proto';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
  root: {},
}));

// enum is a reserved word, hence enm prop
const EnumContent: React.FC<{ enm: protobuf.Enum }> = ({ enm }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ContentHeader object={enm} />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {valuesByID(enm).map(({ id, value }) => (
              <TableRow>
                <TableCell>{id}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default EnumContent;
