import React from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ContentHeader from './ContentHeader';
import Link from './Link';
import { fullName, typeName } from './proto';

const useStyles = makeStyles(theme => ({
  root: {},
  list: {
    columnWidth: '400px',
    padding: 0,
    listStyleType: 'none',
  },
  type: {
    fontSize: '0.8em',
    paddingLeft: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const NamespaceContent: React.FC<{ namespace: protobuf.Namespace }> = ({
  namespace,
}) => {
  const classes = useStyles();
  const sorted = [...namespace.nestedArray];
  sorted.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className={classes.root}>
      <ContentHeader object={namespace} />
      <Typography>
        <ol className={classes.list}>
          {sorted.map(obj => (
            <li key={obj.fullName}>
              <Link to={`/${fullName(obj)}`}>{obj.name}</Link>
              <span className={classes.type}>{typeName(obj)}</span>
            </li>
          ))}
        </ol>
      </Typography>
    </div>
  );
};

export default NamespaceContent;
