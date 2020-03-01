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
  code: {
    display: 'block',
    whiteSpace: 'pre-wrap',
    maxHeight: '54em',
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
}));

const baseUrl = '';
const username = '';
const password = '';

const TwirpCurlButton: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [snackbarShowing, setSnackbarShowing] = React.useState(false);

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
                <code className={classes.code}>
                  {twirpCurl(method, baseUrl, username, password, true)}
                </code>
              </TableBody>
            </Table>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default TwirpCurlButton;
