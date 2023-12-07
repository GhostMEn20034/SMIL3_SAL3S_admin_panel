import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

export default function VariationThemeDelete({ open, setOpen, onSubmit, error, setError }) {

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
          {"Delete Variation theme"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Before variation theme removal make sure that there are no products with this variation theme<br />
            Are you sure you want to delete variation theme?
          </DialogContentText>
          {error && (
            <Box sx={{mt: 2}}>
                <Alert severity='error' onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Box>
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