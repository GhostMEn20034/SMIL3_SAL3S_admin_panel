import { Box, Stack, IconButton } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AttrInput from "../ProductComponents/mapAttrTypeToComponent";
import SelectValue from "../SelectValue";
import { removeAttr, handleChangeAttrGroup, arrayToMenuItems } from "../../utils/Services";

export default function ProductAttrs(props) {


    return (
        <Box>
            {props.attrs.map((attr, index) => (
                <Stack key={index} direction="row" sx={{ mb: 2}}>
                    <Stack key={index}>
                        <AttrInput attr={attr} facet={props.facets.find(facet => facet.code === attr.code)} index={index} 
                        setAttrs={props.setAttrs} errorHandler={props.errorHandler} displayErrors={props.displayErrors} 
                        baseErrorPath={props.baseErrorPath}
                        />
                    </Stack>
                    <Stack sx={{ ml: 1 }}>
                        <SelectValue label={"Group"} value={attr.group ? attr.group : ""} setValue={(newValue) => handleChangeAttrGroup(index, newValue, props.setAttrs)}
                            menuItems={[
                                { name: "No group", value: null },
                                ...arrayToMenuItems(props.groups)
                            ]}
                        />
                    </Stack>
                    {attr.optional === true && (
                        <IconButton onClick={() => removeAttr(index, props.setAttrs)} sx={{ ml: 1, maxHeight: "40px" }}>
                            <RemoveIcon />
                        </IconButton>
                    )}
                </Stack>
            ))}
        </Box>
    )
}