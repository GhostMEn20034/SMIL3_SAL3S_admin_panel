import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function SelectValueRadioGroup(props) {


  const handleChange = (event) => {
    props.setValue(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">{props.label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={props.value}
        onChange={handleChange}
      >
        {props.menuItems.map((menuItem, index) => (
          <FormControlLabel key={index} value={menuItem["value"]} control={<Radio />} label={menuItem["name"]} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}