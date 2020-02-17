import React from 'react';
import { IconButton, Tooltip, Snackbar } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';

const CurlButton: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(JSON.stringify(method));
    console.log(method);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Tooltip title="Copy as cURL" placement="top">
          <FileCopyIcon fontSize="small" />
        </Tooltip>
      </IconButton>
      <Snackbar
        message="Successfully copied to clipboard"
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default CurlButton;
