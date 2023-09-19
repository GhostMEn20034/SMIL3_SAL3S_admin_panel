import { Box, TextField, Stack } from "@mui/material";
import FacetInput from "../ProductComponents/mapFacetTypeToComponent";

export default function ProductAttrs(props) {


    return (
        <Box>
            {props.attrs.map((attr, index) => (
                <Stack sx={{ mb: 2 }} key={index}>
                    <FacetInput attr={attr} facet={props.facets.find(facet => facet.code === attr.code)}/>

                </Stack>
            ))}
        </Box>

    )
}