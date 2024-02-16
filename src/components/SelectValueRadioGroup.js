import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function SelectValueRadioGroup(props) {


  const handleChange = (event) => {
    let value;
    switch (props.valueType) {
      case "boolean":
        value = JSON.parse(event.target.value);
        break;
      case "number":
        value = Number(event.target.value);
        break;
      // add more cases for other types as needed
      default:
        value = event.target.value;
    }
    props.setValue(value);
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
          <FormControlLabel disabled={props.disabledIndexes?.includes(index)} key={index} value={menuItem["value"]} control={<Radio />} label={menuItem["name"]} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}