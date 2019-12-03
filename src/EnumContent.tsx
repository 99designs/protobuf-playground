import React from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import ContentHeader from './ContentHeader';

const useStyles = makeStyles(theme => ({
  root: {},
}));

// enum is a reserved word, hence enm prop
const EnumContent: React.FC<{ enm: protobuf.Enum }> = ({ enm }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ContentHeader object={enm} />
    </div>
  );
};

export default EnumContent;
