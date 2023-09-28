import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Typography, Button } from '@mui/material';

export default function ProductNavigation(props) {

    const handleChange = (index) => {
        props.setValue(index);
    };

    const underlineProps = {
        textDecoration: "underline", textDecorationThickness: 2.5, textUnderlineOffset: 4,
    };

    const noUnderlineProps = {
        textDecoration: "none",
    };

    return (
        <Box sx={{ width: 550, display: "flex" }}>

            {props.values.map((value, index) => (
                <Button
                    key={index}
                    size='small'
                    sx={{ mr: index !== props.values.length - 1 }}
                    onClick={() => handleChange(index)}
                >
                    <Typography variant='button' sx={index === props.value ? underlineProps : noUnderlineProps}>
                        {value}
                    </Typography>
                </Button>
            ))}
        </Box>
    );
}