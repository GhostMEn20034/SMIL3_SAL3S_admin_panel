import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FacetDelete({ open, setOpen, onSubmit }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Facet"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            After facet removal user won't be able to find desired product by this facet.<br />
            Are you sure you want to delete facet?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='warning' variant='contained'>No</Button>
          <Button onClick={onSubmit} autoFocus color='error' variant='contained'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
  );
}