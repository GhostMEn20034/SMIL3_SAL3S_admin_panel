import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Alert  from '@mui/material/Alert';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CategoryDelete({ open, setOpen, onSubmit, error, setError }) {

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
          {"Delete Category"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete facet?
          </DialogContentText>
          {error && (
            <Alert severity='error' sx={{mt: 2}} onClose={() => setError("")}>
                {error}
            </Alert>
          )}
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