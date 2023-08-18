import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectValue({ value, setValue, menuItems, label, disabled }) {

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const disabledInput = disabled ? true : false;

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
      {menuItems.map((menuItem) => (
        <MenuItem value={menuItem.value}>{menuItem.name}</MenuItem>
      ))}
      </Select>
    </FormControl>
  );
}
