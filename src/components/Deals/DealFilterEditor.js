import { useState } from "react";
import { Box, Button, Divider, IconButton } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';

import SelectValue from "../SelectValue";
import { facetsToAttrs } from "../../utils/Services";
import AttrInput from "../Product/mapAttrTypeToComponent";

export default function DealFilterEditor(props) {
    const [currentAttributeCode, setCurrentAttributeCode] = useState(null);

    const addAttributeToOtherFilters = (facetCode) => {
        props.setOtherFilters((prevValues) => {
            let foundFacet = props.facets.find(facet => facet.code === facetCode);
            if (foundFacet) {
                let attribute = facetsToAttrs([foundFacet])[0]
                return [...(prevValues ? prevValues : []), attribute];
            }

            return prevValues
        });
        setCurrentAttributeCode(null);
    };

    return (
        <Box>
            <Box display={"flex"}>
                <SelectValue value={currentAttributeCode ? currentAttributeCode : ""}
                    setValue={setCurrentAttributeCode}
                    objectKey={"code"}
                    label={"Choose an attribute"}
                    menuItems={[
                        { "code": null, "name": "No chosen attribute" },
                        ...(props.facets ? props.facets : []),
                    ]}
                    otherProps={{ width: 300 }}
                />
                <Button size="small"
                    variant="contained" sx={{ ml: 2 }}
                    disabled={!currentAttributeCode}
                    onClick={() => addAttributeToOtherFilters(currentAttributeCode)}
                >
                    Add Atrribute
                </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{mb: 4}}>
                {props.otherFilters.map((otherFilter, index) => (
                    <Box key={index} sx={{ mt: 2 }} display={"flex"}>
                        <AttrInput
                            attr={otherFilter}
                            setAttrs={props.setOtherFilters}
                            facet={props.facets.find(facet => facet.code === otherFilter.code)}
                            index={index}
                            displayErrors={true}
                            errorHandler={props.errorHandler}
                            baseErrorPath={["other_filters", index]}
                        />
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <IconButton sx={{ ml: 1 }} onClick={() => props.deleteOtherFilter(index)}>
                                <RemoveIcon />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}