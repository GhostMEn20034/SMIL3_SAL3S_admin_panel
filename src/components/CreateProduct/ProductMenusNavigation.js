import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';


export default function ProductMenusNavigation(props) {

  const handleChange = (event, newValue) => {
    props.setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={props.value}
        onChange={handleChange}
        aria-label="secondary tabs example"
      >
        {props.labels.map((label, index) => (
            <Tab value={index} label={label} disabled={index === props.disabledButtonIndex} key={index}/>
        ))}
      </Tabs>
    </Box>
  );
}