import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, TextField, IconButton, Tooltip, Button } from "@mui/material";

export default function EditableList(props) {
    /**
     * Component to edit a list (array) of strings
     */
    const [newArrayElem, setNewArrayElem] = useState("");
    const entityName = props.entityName ? props.entityName : "Item";
    const arrayLimit = props.arrayLimit ? props.arrayLimit : 30;

    const changeArrayValue = (newValue, index) => {
        props.setValues((prevValues) => {
            const newArray = [...prevValues];
            newArray[index] = newValue;
            return newArray;
        });
    };

    const addValueToArray = (newValue) => {
        props.setValues((prevValues) => {
            if (!newValue) {
                newValue = "";
            }
            return [...prevValues, newValue];
        });
        setNewArrayElem("");
    };

    const removeValueFromArray = (index) => {
        props.setValues((prevValues) => {
            const newArray = [...prevValues];
            newArray.splice(index, 1);
            return newArray;
        });
    };

    return (
        <Box>
            {/* List of text boxes */}
            <Box>
                {props.values.map((value, index) => (
                        <Box display="flex" key={index} sx={{mb: 1}}>
                            <TextField size='small' value={value} onChange={(e) => changeArrayValue(e.target.value, index)}/>
                            <Tooltip title={`Remove ${entityName}`}>
                                <IconButton size='small' onClick={() => removeValueFromArray(index)} sx={{padding: 0.9}}>
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ))
                }
                <TextField 
                label={`New ${entityName}`}
                size="small"
                value={newArrayElem} 
                onChange={(e) => setNewArrayElem(e.target.value)} 
                sx={{mt: 0.5}}
                />
            </Box>
            {/* Action buttons (Add element, remove, etc.) */}
            <Box sx={{mt: 0.4}}>
                <Button size='small' onClick={() => addValueToArray(newArrayElem)} disabled={props.values.length >= arrayLimit || newArrayElem.trim() === ""}>
                    {`Add ${entityName}`}
                </Button>
            </Box>
        </Box>
    );
}
