import { useState } from "react";
import TextField from "@mui/material/TextField";
import SelectValue from "../SelectValue";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NumericFormat } from 'react-number-format';
import ChipsArray from "../ChipsArray";
import { arrayToMenuItems, handleChangeAttrs, handleChangeAttrUnit, addListValue } from "../../utils/Services";



export default function AttrInput(props) {
    const [newListValue, setNewListValue] = useState("");

    // if displayErrors is true and class for error handling was passed, then return
    const findError = (code) => {
        if (!props.displayErrors || !props.errorHandler) {
            return {};
        }

        if (!props.errorHandler?.isValueExist(...(props.baseErrorPath ? props.baseErrorPath : ""), code)) {
            return {};
        }

        return {
            "error": true,
            "helperText": props.errorHandler.getObjectValue(...(props?.baseErrorPath ? props?.baseErrorPath : ""), code)
        };
    };

    switch (props.attr.type) {
        case "list":
            return (
                <Stack sx={{ minWidth: 325, maxWidth: 395 }}>
                    <Box display={"flex"}>
                        <TextField value={newListValue}
                            onChange={(e) => setNewListValue(e.target.value)}
                            label={`New ${props.attr.name}`}
                            size="small"
                            sx={{ mr: 2 }}
                            {...findError(props.attr.code)}
                        />
                        <Button size="small" color="primary" variant="contained" sx={{ maxHeight: "40px" }}
                            onClick={
                                () => {
                                    addListValue(props.index, newListValue, props.setAttrs);
                                    setNewListValue("");
                                }
                            }
                            disabled={newListValue === ""}
                        >
                            {`Add new ${props.attr.name}`}
                        </Button>
                    </Box>
                    <Box>
                        <ChipsArray array={props.attr.value} removeValue={
                            (listValueIndex) => {
                                props.setAttrs(
                                    (prevAttrs) => {
                                        return [
                                            // Copy the elements before the index
                                            ...prevAttrs.slice(0, props.index),
                                            // Create a new object with the updated value for the index
                                            {
                                                ...prevAttrs[props.index],
                                                // Update value array
                                                value: prevAttrs[props.index].value.filter((item, i) => i !== listValueIndex)
                                            },
                                            // Copy the elements after the index
                                            ...prevAttrs.slice(props.index + 1),
                                        ];
                                    }
                                );
                            }
                        } />
                    </Box>
                </Stack>
            );
        case "integer":
            return (
                <Stack direction="row">
                    <NumericFormat
                        value={props.attr.value}
                        onChange={(e) => handleChangeAttrs(props.index, Number(e.target.value), props.setAttrs)}
                        decimalScale={0}
                        allowNegative={false}
                        // Use customInput prop to pass TextField component
                        customInput={TextField}
                        label={props.attr.name}
                        size="small"
                        sx={{ minWidth: 325 }}
                        {...findError(props.attr.code)}
                    />
                    {props.facet?.units && (
                        <Stack sx={{ ml: 1 }}>
                            <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit" setValue={(newValue) => handleChangeAttrUnit(props.index, newValue, props.setAttrs)} />
                        </Stack>
                    )}
                </Stack>
            )
        case "decimal":
            return (
                <Stack direction="row">
                    <NumericFormat
                        value={props.attr.value}
                        onChange={(e) => handleChangeAttrs(props.index, Number(e.target.value), props.setAttrs)}
                        decimalScale={2}
                        decimalSeparator="."
                        allowNegative={false}
                        // Use customInput prop to pass TextField component
                        customInput={TextField}
                        label={props.attr.name}
                        size="small"
                        sx={{ minWidth: 325 }}
                        {...findError(props.attr.code)}
                    />
                    {props.facet?.units && (
                        <Stack sx={{ ml: 1 }}>
                            <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit" setValue={(newValue) => handleChangeAttrUnit(props.index, newValue, props.setAttrs)} />
                        </Stack>
                    )}
                </Stack>
            )
        case "string":
            return (
                <Stack direction="row">
                    {!props.facet?.values ? (
                        <TextField
                            value={props.attr.value}
                            label={props.attr.name}
                            size="small" sx={{ minWidth: 325 }}
                            onChange={(e) => handleChangeAttrs(props.index, e.target.value, props.setAttrs)}
                            {...findError(props.attr.code)}
                        />
                    ) : (
                        <SelectValue
                            value={props.attr.value}
                            menuItems={arrayToMenuItems(props.facet.values)}
                            label={props.attr.name}
                            setValue={(newValue) => handleChangeAttrs(props.index, newValue, props.setAttrs)}
                            otherProps={{ minWidth: 325}}
                            errors={{...findError(props.attr.code)}}
                        />
                    )}

                    {props.facet?.units && (
                        <Stack sx={{ ml: 1 }}>
                            <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit" setValue={(newValue) => handleChangeAttrUnit(props.index, newValue, props.setAttrs)} />
                        </Stack>
                    )}
                </Stack>
            );
        case "bivariate":
            return (
                <Stack direction="row" alignItems="baseline">
                    <NumericFormat
                        decimalScale={2}
                        decimalSeparator="."
                        // Use customInput prop to pass TextField component
                        customInput={TextField}
                        value={props.attr.value["x"]}
                        label={props.attr.name}
                        size="small"
                        onChange={(e) => handleChangeAttrs(props.index, Number(e.target.value), props.setAttrs, "x")}
                        {...findError(props.attr.code)}
                    />
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mx: 1 }}>
                        <Typography variant="body1">
                            &#10006;
                        </Typography>
                    </Box>
                    <NumericFormat
                        decimalScale={2}
                        decimalSeparator="."
                        // Use customInput prop to pass TextField component
                        customInput={TextField}
                        value={props.attr.value["y"]}
                        label={props.attr.name}
                        size="small"
                        onChange={(e) => handleChangeAttrs(props.index, Number(e.target.value), props.setAttrs, "y")}
                        {...findError(props.attr.code)}
                    />
                    {props.facet?.units && (
                        <Stack sx={{ ml: 1 }}>
                            <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit" setValue={(newValue) => handleChangeAttrUnit(props.index, newValue, props.setAttrs)} />
                        </Stack>
                    )}
                </Stack>
            );
        case "trivariate":
            return (
                <Stack direction="row" alignItems="baseline">
                    <NumericFormat
                        decimalScale={2}
                        decimalSeparator="."
                        // Use customInput prop to pass TextField component
                        customInput={TextField}
                        value={props.attr.value["x"]}
                        label={props.attr.name}
                        size="small"
                        onChange={(e) => handleChangeAttrs(props.index, Number(e.target.value), props.setAttrs, "x")}
                        {...findError(props.attr.code)}
                    />
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mx: 1 }}>
                        <Typography variant="body1">
                            &#10006;
                        </Typography>
                    </Box>
                    <NumericFormat
                        decimalScale={2}
                        decimalSeparator="."
                        // Use customInput prop to pass TextField component
                        customInput={TextField}
                        value={props.attr.value["y"]}
                        label={props.attr.name}
                        size="small"
                        onChange={(e) => handleChangeAttrs(props.index, Number(e.target.value), props.setAttrs, "y")}
                        {...findError(props.attr.code)}
                    />
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mx: 1 }}>
                        <Typography variant="body1">
                            &#10006;
                        </Typography>
                    </Box>
                    <NumericFormat
                        decimalScale={2}
                        decimalSeparator="."
                        // Use customInput prop to pass TextField component
                        customInput={TextField}
                        value={props.attr.value["z"]}
                        label={props.attr.name}
                        size="small"
                        onChange={(e) => handleChangeAttrs(props.index, Number(e.target.value), props.setAttrs, "z")}
                        {...findError(props.attr.code)}
                    />
                    {props.facet?.units && (
                        <Stack sx={{ ml: 1 }}>
                            <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit" setValue={(newValue) => handleChangeAttrUnit(props.index, newValue, props.setAttrs)} />
                        </Stack>
                    )}
                </Stack>
            );
        default:
            return (
                <Stack>
                    <TextField
                        value={props.attr.value}
                        label={props.attr.name}
                        size="small" sx={{ minWidth: 325 }}
                        onChange={(e) => handleChangeAttrs(props.index, e.target.value, props.setAttrs)}
                        {...findError(props.attr.code)}
                    />
                </Stack>
            )
    }
}