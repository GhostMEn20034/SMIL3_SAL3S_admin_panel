import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';


export default function MenusNavigation(props) {

  const handleChange = (event, newValue) => {
    props.setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={props.value}
        onChange={handleChange}
      >
        {props.labels.map((label, index) => (
            <Tab value={index} label={label} disabled={props.disabledButtonIndexes.includes(index)} key={index}/>
        ))}
      </Tabs>
    </Box>
  );
}