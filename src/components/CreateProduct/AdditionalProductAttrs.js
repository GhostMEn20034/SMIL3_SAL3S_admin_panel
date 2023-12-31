import { Box, IconButton, Stack, TextField } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AttrInput from "../Product/mapAttrTypeToComponent";
import { extraAttr } from "../../utils/consts";
import { handleChangeAttrName, handleChangeAttrType, handleChangeAttrUnit, removeAttr, addAttr } from "../../utils/Services";
import SelectValue from "../SelectValue";

export default function AdditionalProductAttrs(props) {
    return (
        <Box>
            {props.additionalAttrs.map((additionalAttr, index) => (
                <Stack sx={{ mb: 2 }} key={index} direction="row">
                    <TextField
                    size="small" 
                    value={additionalAttr.name} 
                    label={"Name"} 
                    onChange={(e) => handleChangeAttrName(index, e.target.value, props.setAdditionalAttrs)} sx={{mr: 1}}
                    error={props.errorHandler?.isValueExist("extra_attrs", index, "name")}
                    helperText={props.errorHandler?.getObjectValue("extra_attrs", index, "name")}
                    />
                    <AttrInput 
                    attr={additionalAttr} 
                    index={index} 
                    setAttrs={props.setAdditionalAttrs} 
                    errorHandler={props.errorHandler} 
                    displayErrors={props.displayErrors}
                    baseErrorPath={props.baseErrorPath}
                    />
                    <TextField size="small" value={additionalAttr.unit ? additionalAttr.unit : ""} label={"Unit"} onChange={(e) => handleChangeAttrUnit(index, e.target.value, props.setAdditionalAttrs)} sx={{mr: 1, ml: 1 }}/>
                    <SelectValue value={additionalAttr.type} menuItems={props.facetTypes} label={"Type"} setValue={(newValue) => handleChangeAttrType(index, newValue, props.setAdditionalAttrs)}/>
                    <Stack direction="row" sx={{ml: 1}}>
                        <IconButton sx={{height: 40}} onClick={() => removeAttr(index, props.setAdditionalAttrs)}>
                            <RemoveIcon />
                        </IconButton>
                        <IconButton sx={{height: 40}} onClick={() => addAttr(props.setAdditionalAttrs, extraAttr)}>
                            <AddIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            ))}
        </Box>
    )
}