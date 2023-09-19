import TextField from "@mui/material/TextField";
import SelectValue from "../SelectValue";
import Stack from "@mui/material/Stack";
import { arrayToMenuItems } from "../../utils/Services";


export default function FacetInput(props) {
    switch (props.facet.type) {
        case "list":
            return (
                <Stack>
                    <SelectValue value={props.attr.value} menuItems={arrayToMenuItems(props.facet.values)} label={props.attr.name} />
                </Stack>
            );
        case "string":
        case "integer":
        case "decimal":
            return (
                <Stack direction="row">
                    <TextField value={props.attr.value} label={props.attr.name} size="small" sx={{mr: 1}}/>
                    {props.facet.units && (
                        <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit"/>
                    )}
                </Stack>
            );
        case "bivariate":
            return (
                <Stack direction="row">
                    <TextField value={props.attr.value[0]} label={props.attr.name + " X"} size="small" sx={{ mr: 1 }} />
                    <TextField value={props.attr.value[1]} label={props.attr.name + " Y"} size="small" sx={props.facet.units ? 1 : 0}/>
                    {props.facet.units && (
                        <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit"/>
                    )}
                </Stack>
            );
        default:
            return (
                <h1>
                    M-m-m
                </h1>
            )
    }
}