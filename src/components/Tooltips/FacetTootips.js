import { Box, Typography } from "@mui/material";

export function RangeFacetExplanation() {
    return (
        <Box>
            <Typography variant="body1">
                <b>Range Facet</b>
            </Typography>
            <Typography variant="body2">
                Use range facets when the value of the facet can have big amount of possible values. <br />
                <b>For example</b>: <br />
                You have a facet "Display size" some product can have value 6.1, other product can be with value 6.5, another one can have value 7.1. <br />
                Instead of showing all values with small difference, you can use range facet to show ranges of value to reduce load on the server. <br />
            </Typography>
        </Box>
    )
}