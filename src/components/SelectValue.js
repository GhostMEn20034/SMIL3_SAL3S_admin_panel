import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectValue({ value, setValue, menuItems, label, disabled, objectKey, objectValue }) {

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const disabledInput = disabled ? true : false;
  const displayName = objectValue ? objectValue : "name";
  const menuValue = objectKey ? objectKey : "value";


  return (
    <FormControl sx={{ minWidth: 120 }} size="small" disabled={disabledInput}>
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label={label}
        onChange={handleChange}
      >
      {menuItems.map((menuItem, index) => (
        <MenuItem key={index} value={menuItem[menuValue]}>{menuItem[displayName]}</MenuItem>
      ))}
      </Select>
    </FormControl>
  );
}
