import React from 'react';
import {
  IconButton,
  Tooltip,
  Snackbar,
  Modal,
  Paper,
  makeStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fade,
  TextField,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';
import CodeIcon from '@material-ui/icons/Code';
import { twirpCurl } from './twirp';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    maxWidth: '54em',
    '&:focus': {
      outline: 'none',
    },
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    marginRight: theme.spacing(2),
  },
  code: {
    display: 'block',
    whiteSpace: 'pre-wrap',
    maxHeight: '54em',
    overflowY: 'auto',
    padding: theme.spacing(2),
    backgroundColor: 'black',
    color: 'white',
    borderRadius: theme.shape.borderRadius,
    fontSize: '12px',
    fontFamily: 'Monaco, monospace',
  },
}));

const TwirpCurlButton: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [snackbarShowing, setSnackbarShowing] = React.useState(false);
  const [baseUrl, setBaseUrl] = React.useState('https://example.com/api/');
  const [username, setUsername] = React.useState('username');
  const [password, setPassword] = React.useState('password');

  const formattedTwirpCurl = React.useMemo(
    () => twirpCurl(method, baseUrl, username, password, true),
    [method, baseUrl, username, password]
  );

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(
      twirpCurl(method, baseUrl, username, password)
    );
    setSnackbarShowing(true);
  };

  return (
    <>
      <IconButton onClick={() => setModalOpen(true)}>
        <Tooltip title="Show Twirp cURL request" placement="top">
          <CodeIcon fontSize="small" />
        </Tooltip>
      </IconButton>
      <Snackbar
        message="Successfully copied to clipboard"
        open={snackbarShowing}
        autoHideDuration={5000}
        onClose={() => setSnackbarShowing(false)}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarShowing(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Modal
        open={modalOpen}
        className={classes.modal}
        onBackdropClick={() => setModalOpen(false)}
        onKeyDown={e => {
          if (e.keyCode === 27) {
            setModalOpen(false);
          }
        }}
      >
        <Fade in={modalOpen}>
          <Paper className={classes.modalContent}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.title}>
                    <span>{method.name}</span>
                    <IconButton onClick={handleCopyClick}>
                      <Tooltip title="Copy Twirp cURL request" placement="top">
                        <FileCopyIcon fontSize="small" />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <TextField
                      id="base-url"
                      label="Base URL"
                      variant="outlined"
                      size="small"
                      className={classes.input}
                      onChange={e => setBaseUrl(e.target.value)}
                    />
                    <TextField
                      id="username"
                      label="Username"
                      variant="outlined"
                      size="small"
                      className={classes.input}
                      onChange={e => setUsername(e.target.value)}
                    />
                    <TextField
                      id="password"
                      label="Password"
                      variant="outlined"
                      size="small"
                      className={classes.input}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <pre>
                      <code
                        className={classes.code}
                        dangerouslySetInnerHTML={{ __html: formattedTwirpCurl }}
                      />
                    </pre>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default TwirpCurlButton;
