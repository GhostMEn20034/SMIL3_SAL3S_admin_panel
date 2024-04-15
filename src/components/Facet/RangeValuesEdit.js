import { Alert, Box, Button, Chip, Divider, IconButton, TextField } from "@mui/material";
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { memo, useState } from "react";

import SelectValue from "../SelectValue";
import { NumericFormat } from "react-number-format";
import HtmlTooltip from "../HtmlTooltip";
import { RangeFacetExplanation } from "../Tooltips/FacetTootips";

const RangeValuesEdit = memo(function RangeValuesEdit(props) {
    const [newGteq, setNewGteq] = useState(0); // new Greater Than Equal value
    const [newLtn, setNewLtn] = useState(null); // new Less Than Equal value
    const [newDisplayName, setNewDisplayName] = useState(''); // new Display Name (Name of the filter that the user sees on the product list page in the main frontend)

    return (
        <Box>
            <Box display="flex" alignItems="center">
                <Box>
                    <SelectValue
                        value={props.isRange}
                        setValue={(newValue) => props.setIsRange(Boolean(newValue))}
                        label="Is Range"
                        menuItems={[
                            { value: false, "name": "No" },
                            { value: true, "name": "Yes" },
                        ]}
                    />
                </Box>
                <Box sx={{ ml: 2 }}>
                    <HtmlTooltip title={
                        <RangeFacetExplanation />
                    }>
                        <HelpOutlineOutlinedIcon sx={{ ":hover": { cursor: "pointer" } }} />
                    </HtmlTooltip>
                </Box>
            </Box>
            {props.errorHandler.isValueExist("range_values") && (
                <Box sx={{my: 2}}>
                    <Alert severity="error">
                        {props.errorHandler.getObjectValue("range_values")}
                    </Alert>
                </Box>
            )}

            {props.isRange && ['integer', 'decimal'].includes(props.type) && (
                <Box sx={{ mb: 4 }}>
                    <Divider sx={{ my: 1 }}>
                        <Chip size="small" label="Range Values" />
                    </Divider>
                    {props.rangeValues && (
                        <Box>
                            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                                <Button 
                                    size="small" 
                                    onClick={props.generateRangeValueDisplayName}
                                    variant="outlined"
                                >
                                    Generate "Display Name" Fields
                                </Button>
                            </Box>
                            <Box>
                                {props.rangeValues.map((rangeValue, index) => (
                                    <Box key={index} display="flex" alignItems="center" sx={{ mt: 3 }}>
                                        <Box display="flex">
                                            <NumericFormat
                                                decimalSeparator="."
                                                decimalScale={props.type === 'integer' ? 0 : 2}
                                                customInput={TextField}
                                                value={rangeValue?.gteq}
                                                name="gteq" // Greater Than Equal
                                                label="Greater Than Equal"
                                                onChange={
                                                    (e) => props.setRangeValues(index, e.target.name, Number(e.target.value))
                                                }
                                                size="small"
                                                sx={{ mr: 2 }}
                                            />
                                            <NumericFormat
                                                decimalSeparator="."
                                                decimalScale={props.type === 'integer' ? 0 : 2}
                                                customInput={TextField}
                                                value={rangeValue?.ltn ? rangeValue?.ltn : Infinity}
                                                name="ltn" // Less Than
                                                label="Less Than"
                                                onChange={
                                                    (e) => props.setRangeValues(index, e.target.name, Number(e.target.value))
                                                }
                                                size="small"
                                                sx={{ mr: 2 }}
                                            />
                                            <TextField
                                                value={rangeValue?.display_name}
                                                name="display_name"
                                                label="Display Name"
                                                size="small"
                                                error={props.errorHandler.isValueExist("range_values", index, "display_name")}
                                                helperText={props.errorHandler.getObjectValue("range_values", index, "display_name")}
                                                onChange={
                                                    (e) => props.setRangeValues(index, e.target.name, e.target.value)
                                                }
                                                sx={{ mr: 2 }}
                                            />
                                        </Box>
                                        <Box>
                                            <IconButton onClick={() => props.removeRangeValue(index)}>
                                                <RemoveOutlinedIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                    <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                        <Box display="flex">
                            <NumericFormat
                                decimalSeparator="."
                                decimalScale={props.type === 'integer' ? 0 : 2}
                                customInput={TextField}
                                value={newGteq}
                                name="gteq" // Greater Than Equal
                                label="Greater Than Equal"
                                onChange={
                                    (e) => setNewGteq(Number(e.target.value))
                                }
                                size="small"
                                sx={{ mr: 2 }}
                            />
                            <NumericFormat
                                decimalSeparator="."
                                decimalScale={props.type === 'integer' ? 0 : 2}
                                customInput={TextField}
                                value={newLtn ? newLtn : Infinity}
                                name="ltn" // Less Than
                                label="Less Than"
                                onChange={
                                    (e) => setNewLtn(Number(e.target.value) > 0 ? Number(e.target.value) : null)
                                }
                                size="small"
                                sx={{ mr: 2 }}
                            />
                            <TextField
                                value={newDisplayName}
                                name="display_name"
                                label="Display Name"
                                size="small"
                                onChange={
                                    (e) => setNewDisplayName(e.target.value)
                                }
                                sx={{ mr: 2 }}
                            />
                        </Box>
                        <Box>
                            <Button
                                size="small"
                                onClick={() => {
                                    props.AddRangeValue(newGteq, newLtn, newDisplayName);
                                    setNewDisplayName('');
                                    setNewGteq(0);
                                    setNewLtn(null);
                                }}
                                variant="outlined"
                            >
                                Add New Range Value
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    )
});


export default RangeValuesEdit;
