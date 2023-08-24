import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


export default function MultipleSelect({ value, setValue, objectKey, objectValue, menuItems, label, index }) {

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        
        if (index !== null && index !== undefined) {
            setValue(value, index);
        } else {
            setValue(value);
        }

    };

    return (
        <div>
            <FormControl sx={{ width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={value}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label={label} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={menuItems.find(item => item[objectKey] === value).name} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {menuItems.map((menuItem) => (
                        <MenuItem
                            key={menuItem[objectKey]}
                            value={menuItem[objectKey]}
                        >
                            {menuItem[objectValue]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
