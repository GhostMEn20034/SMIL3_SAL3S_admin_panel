import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MultipleSelect from '../MultipleSelectValue';
import SelectValueRadioGroup from '../SelectValueRadioGroup';
import SelectValue from '../SelectValue';
import { arrayToMenuItems, modifyName, getAttrString } from '../../utils/Services';
import { attrSeparators } from '../../utils/consts';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Dialog where user can modify multiple product names
export function ModifyMultipleNamesDialog(props) {
  const [selectedAttrs, setSelectedAttrs] = React.useState([]); // list of attribute codes
  const [addVariationAttrs, setAddVariationAttrs] = React.useState(false); // boolean, defines whether include product variation attrs to the product name.
  const [separator, setSeparator] = React.useState(" | "); // string, symbol to separate attrs in the product name.


  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSubmit = () => {
    let filteredAttrs = props.attrs.filter((attr) => selectedAttrs.includes(attr.code));
    modifyName(
      props.nameValue,
      filteredAttrs,
      separator, props.checkedProducts,
      props.setProductVariations, addVariationAttrs
    );
    handleClose();
    props.resetProductName();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle>{"Modify product names"}</DialogTitle>
        <DialogContent>
          <Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                value={props.nameValue}
                onChange={(e) => props.changeName(e.target.value)}
                margin="dense"
                id="name"
                label="Product Name"
                size='small'
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <MultipleSelect
                value={selectedAttrs}
                setValue={setSelectedAttrs}
                objectKey={"code"}
                objectValue={"name"}
                menuItems={props.attrs}
                label={"Product Attributes"}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <SelectValue
                value={separator}
                setValue={setSeparator}
                menuItems={[...arrayToMenuItems(attrSeparators), {"name": "Space", "value": " "}]}
                label={"Atrribute separator"}
                formProperties={{minWidth: 200}}
              />
            </Box>
            <Box>
              <SelectValueRadioGroup label={"Include product variation attributes"} value={addVariationAttrs} setValue={setAddVariationAttrs} menuItems={[
                { name: "No", value: false },
                { name: "Yes", value: true }
              ]} valueType={"boolean"} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Back</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export function ModifyNameDialog (props) {
  const [selectedAttrs, setSelectedAttrs] = React.useState([]); // list of attribute codes
  const [separator, setSeparator] = React.useState(" | "); // string, symbol to separate attrs in the product name.


  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSubmit = () => {
    let filteredAttrs = props.attrs.filter((attr) => selectedAttrs.includes(attr.code));
    let modifiedProductName = props.nameValue + (props.nameValue.length > 0 ? " " : "") + getAttrString(filteredAttrs, separator);
    props.changeName(modifiedProductName);
    handleClose();
    // props.resetProductName();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle>{"Modify product name"}</DialogTitle>
        <DialogContent>
          <Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                value={props.nameValue}
                onChange={(e) => props.changeName(e.target.value)}
                margin="dense"
                id="name"
                label="Product Name"
                size='small'
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <MultipleSelect
                value={selectedAttrs}
                setValue={setSelectedAttrs}
                objectKey={"code"}
                objectValue={"name"}
                menuItems={props.attrs}
                label={"Product Attributes"}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <SelectValue
                value={separator}
                setValue={setSeparator}
                menuItems={[...arrayToMenuItems(attrSeparators), {"name": "Space", "value": " "}]}
                label={"Atrribute separator"}
                formProperties={{minWidth: 200}}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Back</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}