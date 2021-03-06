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
    fontSize: '16px',
    backgroundColor: theme.palette.grey[100],
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  input: {
    marginRight: theme.spacing(2),
  },
  pre: {
    margin: 0,
  },
  code: {
    display: 'block',
    whiteSpace: 'pre-wrap',
    maxHeight: '54em',
    overflowY: 'auto',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[900],
    color: 'white',
    borderRadius: theme.shape.borderRadius,
    fontSize: '12px',
    fontFamily: 'Monaco, monospace',
  },
  tableCellNoBottomBorder: {
    borderBottom: 'none',
  },
  tableCellNoBottomPadding: {
    paddingBottom: 0,
  },
}));

function TwirpCurlButton({
  method,
  baseUrl,
}: {
  method: protobuf.Method;
  baseUrl: string;
}) {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [snackbarShowing, setSnackbarShowing] = React.useState(false);

  const formattedTwirpCurl = React.useMemo(
    () => twirpCurl(method, baseUrl, 'username', 'password', true),
    [method, baseUrl]
  );

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(
      twirpCurl(method, baseUrl, 'username', 'password')
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
        onBackdropClick={() => handleClose()}
        onKeyDown={e => {
          if (e.keyCode === 27) {
            handleClose();
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
                  <TableCell className={classes.tableCellNoBottomBorder}>
                    <pre className={classes.pre}>
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
}

export default TwirpCurlButton;
