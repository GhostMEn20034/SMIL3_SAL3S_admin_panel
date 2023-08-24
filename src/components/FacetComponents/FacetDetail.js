import { Box, Typography, Divider } from "@mui/material";
import findCategoryByID from "../../utils/FacetServices";
import { Fragment } from "react";


export default function FacetDetail({ facet, categories }) {

    const fields = [
        {
            fieldName: "Id",
            fieldValue: "_id"
        },
        {
            fieldName: "Code",
            fieldValue: "code"
        },
        {
            fieldName: "Name",
            fieldValue: "name"
        },
        {
            fieldName: "Type",
            fieldValue: "type"
        },
    ]

    return (
        <Box sx={{
            padding: 3,
            boxShadow: 3,
            borderRadius: "50px",
            width: "50%",
        }}>
            {fields.map((field, index) => (
                <Fragment key={`${index}-box`}>
                    <Box>
                        <Typography variant="h6">
                            {field.fieldName}: {facet[field.fieldValue]}
                        </Typography>
                    </Box>
                    <Divider />
                </Fragment>
            ))}
            <Box>
                <Typography variant="h6">
                    Optional: {facet.optional ? "Yes" : "No"}
                </Typography>

            </Box>
            <Divider />
            <Box>
                <Typography variant="h6">
                    Show in filters: {facet.show_in_filters ? "Yes" : "No"}
                </Typography>
            </Box>
            <Divider />
            {facet.values && (
                <Box>
                    <Typography variant="h6">
                        Values:
                    </Typography>
                    <Box sx={{ ml: 5 }}>
                        <ul style={{ marginBlockStart: 0 }}>
                            {facet["values"].map((value, index) => (
                                <li key={`${index}-text`}>
                                    <Typography variant="h6">
                                        {value}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </Box>
                </Box>
            )}
            <Divider />
            {facet.categories && (
                <Box>
                    <Typography variant="h6">
                        Categories:
                    </Typography>
                    <Box sx={{ ml: 5 }}>
                        {facet.categories === "*" ? (
                            <Typography variant="h6">
                                {"All categories"}
                            </Typography>
                        ) : (
                            <>
                                <ul style={{ marginBlockStart: 0 }}>
                                    {facet["categories"].map((value, index) => (
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
            )}
            <Divider />
        </Box>
    )
}
