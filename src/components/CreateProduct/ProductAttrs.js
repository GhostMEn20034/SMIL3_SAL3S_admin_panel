import parse from 'html-react-parser';
import { Box, Stack, IconButton, Typography } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Fragment } from "react";

import AttrInput from "../Product/mapAttrTypeToComponent";
import SelectValue from "../SelectValue";
import { removeAttr, handleChangeAttrGroup, arrayToMenuItems } from "../../utils/Services";
import HtmlTooltip from "../HtmlTooltip";


export default function ProductAttrs(props) {


    return (
        <Box>
            {props.attrs.map((attr, index) => (
                <Stack key={index} direction="row" sx={{ mb: 2 }} alignItems={"center"}>
                    <Stack key={index}>
                        <AttrInput attr={attr} facet={props.facets.find(facet => facet.code === attr.code)} index={index}
                            setAttrs={props.setAttrs} errorHandler={props.errorHandler} displayErrors={props.displayErrors}
                            baseErrorPath={[...(props.baseErrorPath ? props.baseErrorPath : [])]}
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
                    {attr.explanation && (
                        <Stack sx={{ ml: 1 }}>
                            <HtmlTooltip placement="left" title={
                                <Fragment>
                                    <Typography color="inherit"><b>{attr.name}</b></Typography>
                                    <Typography variant="body2">
                                        {parse(attr.explanation)}
                                    </Typography>
                                </Fragment>
                            }>
                                <HelpOutlineIcon />
                            </HtmlTooltip>
                        </Stack>
                    )}
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