import React, { useContext } from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import ContentHeader from './ContentHeader';
import { valuesByID } from './proto';
import ProtoContext from './ProtoContext';
import ReflectionObjectList from './ReflectionObjectList';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {},
}));

// enum is a reserved word, hence enm prop
export default function EnumContent({ enm }: { enm: protobuf.Enum }) {
  const classes = useStyles();
  const { getUsages } = useContext(ProtoContext);
  const usages = getUsages(enm);
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
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
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
