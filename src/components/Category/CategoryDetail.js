import { Box, Typography, Divider } from "@mui/material";
import { Fragment } from "react";


export default function CategoryDetail({ category, categoriesForChoices }) {

    const fields = [
        {
            fieldName: "Id",
            fieldValue: "_id"
        },
        {
            fieldName: "Name",
            fieldValue: "name"
        },
        {
            fieldName: "Level",
            fieldValue: "level"
        },
        {
            fieldName: "Tree Id",
            fieldValue: "tree_id"
        },
    ];

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
                            {field.fieldName}:
                        </Typography>
                        <Typography variant="body1">
                            {category[field.fieldValue]}
                        </Typography>
                    </Box>
                    <Divider />
                </Fragment>
            ))}
            <Box>
                <Typography variant="h6">
                    Parent:
                </Typography>
                <Typography variant="body1">
                    {category.parent_id ? categoriesForChoices.find(categoryObj => categoryObj._id === category.parent_id)?.name : "No parent"}
                </Typography>
            </Box>
            <Divider />
            <Box>
                <Typography variant="h6">
                    Groups:
                </Typography>
                <Box sx={{ ml: 5 }}>
                    {!category.groups ? (
                        <Typography variant="h6">
                            {"No groups"}
                        </Typography>
                    ) : (
                        <>
                            <ul style={{ marginBlockStart: 0 }}>
                                {category.groups.map((value, index) => (
                                    <li key={`${index}-li`}>
                                        <Typography variant="body1">
                                            {value}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </Box>
            </Box>
            <Divider />

        </Box>
    )
}
