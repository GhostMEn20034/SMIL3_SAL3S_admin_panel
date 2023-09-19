import { Box, Typography, Divider } from "@mui/material";
import findCategoryByID from "../../utils/Services";
import { Fragment } from "react";

export default function VariationThemeDetail({ variationTheme, categories }) {
    return (
        <Box sx={{
            padding: 3,
            boxShadow: 3,
            borderRadius: "50px",
            width: "50%",
        }}
        >
            <Box>
                <Typography variant="h6">
                    Id: {variationTheme._id}
                </Typography>
            </Box>
            <Divider />
            <Box>
                <Typography variant="h6">
                    Name: {variationTheme.name}
                </Typography>
            </Box>
            <Divider sx={{backgroundColor: "black"}}/>
            {variationTheme.filters && (
                <Box>
                    <Typography variant="h6">
                        Filters:
                    </Typography>
                    <Box sx={{ ml: 3 }}>
                        {variationTheme["filters"].map((filter, index) => (
                            <Fragment key={index}>
                                <Divider sx={{backgroundColor: "black"}}/>
                                <Box>
                                    <Typography variant="h6">
                                        Filter name: {filter.name}
                                    </Typography>
                                    <Typography variant="h6">
                                        Field codes:
                                    </Typography>
                                    <ul style={{ marginBlockStart: 0 }}>
                                        {filter["field_codes"].map((field_code, index) => (
                                            <li key={`${index}-text`}>
                                                <Typography variant="h6">
                                                    {field_code}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
                            </Fragment>
                        ))}
                    </Box>
                </Box>
            )}
            {variationTheme.categories && (
                <Fragment>
                    <Divider sx={{backgroundColor: "black"}} />
                    <Box>
                        <Typography variant="h6">
                            Categories:
                        </Typography>
                        <Box sx={{ ml: 3 }}>
                            {variationTheme.categories === "*" ? (
                                <Typography variant="h6">
                                    {"All categories"}
                                </Typography>
                            ) : (
                                <>
                                    <ul style={{ marginBlockStart: 0 }}>
                                        {variationTheme["categories"].map((value, index) => (
                                            <li key={`${index}-li`}>
                                                <Typography variant="h6">
                                                    {findCategoryByID(value, categories)}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                        </Box>
                    </Box>
                </Fragment>
            )}
        </Box>
    )
}