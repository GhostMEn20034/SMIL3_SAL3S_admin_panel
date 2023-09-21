import TextField from "@mui/material/TextField";
import SelectValue from "../SelectValue";
import Stack from "@mui/material/Stack";
import { arrayToMenuItems, handleChangeAttrs, handleChangeAttrUnit } from "../../utils/Services";


export default function FacetInput(props) {
    switch (props.attr.type) {
        case "list":
            return (
                <Stack>
                    <SelectValue value={props.attr.value} menuItems={arrayToMenuItems(props.facet.values)} label={props.attr.name} setValue={(newValue) => handleChangeAttrs(props.index, newValue, props.setAttrs)} />
                </Stack>
            );
        case "string":
        case "integer":
        case "decimal":
            return (
                <Stack direction="row">
                    <TextField value={props.attr.value} label={props.attr.name} size="small" sx={{ mr: 1, minWidth: 325 }} onChange={(e) => handleChangeAttrs(props.index, e.target.value, props.setAttrs)} />
                    {props.facet.units && (
                        <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit" setValue={(newValue) => handleChangeAttrUnit(props.index, newValue, props.setAttrs)} />
                    )}
                </Stack>
            );
        case "bivariate":
            return (
                <Stack direction="row">
                    <TextField value={props.attr.value[0]} label={props.attr.name + " X"} size="small" sx={{ mr: 1 }} onChange={(e) => handleChangeAttrs(props.index, e.target.value, props.setAttrs, 0)} />
                    <TextField value={props.attr.value[1]} label={props.attr.name + " Y"} size="small" sx={{ mr: props.facet.units ? 1 : 0 }} onChange={(e) => handleChangeAttrs(props.index, e.target.value, props.setAttrs, 1)} />
                    {props.facet.units && (
                        <SelectValue value={props.attr.unit} menuItems={arrayToMenuItems(props.facet.units)} label="Unit" setValue={(newValue) => handleChangeAttrUnit(props.index, newValue, props.setAttrs)} />
                    )}
                </Stack>
            );
        default:
            return (
                <Stack>
                    <SelectValue value={props.attr.value} menuItems={arrayToMenuItems(props.facet.values)} label={props.attr.name} />
                </Stack>
            )
    }
}