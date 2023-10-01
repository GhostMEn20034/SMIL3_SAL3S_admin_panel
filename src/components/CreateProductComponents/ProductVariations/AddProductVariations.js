import { useState } from "react";
import { Box, Stack } from "@mui/material";
import { facetsToAttrs } from "../../../utils/Services";
import FacetInput from "../../ProductComponents/mapFacetTypeToComponent";

export default function AddProductVariations(props) {
    const [newFields, setNewFields] = useState(facetsToAttrs(props.facets)); // Fields for the new varition theme, list of objects


    return (
        <Box
            sx={{
                width: "100%", display: "flex", justifyContent: "center",
                alignItems: "center", boxShadow: 3, padding: 3
            }}
        >
            <Box>
                {newFields.map((newField, index) => (
                    <Stack key={index} sx={{mt: 2}}>
                        <FacetInput attr={newField} facet={props.facets.find(facet => facet.code === newField.code)} index={index} setAttrs={setNewFields} />
                    </Stack>
                ))}
            </Box>
        </Box>
    )
}