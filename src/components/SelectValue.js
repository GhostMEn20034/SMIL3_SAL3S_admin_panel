import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

export default function SelectValue({ value, setValue, menuItems, label, disabled, objectKey, objectValue, otherProps, errors }) {

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const disabledInput = disabled ? true : false;
  const displayName = objectValue ? objectValue : "name";
  const menuValue = objectKey ? objectKey : "value";

  return (
    <FormControl sx={{ minWidth: !otherProps?.minWidth ? 120 : otherProps?.minWidth, maxWidth: !otherProps?.maxWidth ? 480 : otherProps?.maxWidth, ...otherProps }} size="small" disabled={disabledInput} error={errors?.error}>
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
      {errors?.error && (
      <FormHelperText>{errors.helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
