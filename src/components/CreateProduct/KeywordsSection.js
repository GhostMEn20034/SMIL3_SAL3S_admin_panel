import { Fragment } from "react";
import { Box, Paper, Typography } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import HtmlTooltip from "../HtmlTooltip";
import EditableList from "../EditableList";

export default function KeywordsSection(props) {
    return (
        <Box>
            <Box sx={{mb: 3}}>
                <Paper sx={{ padding: 2 }}>
                    <Box display="flex" alignItems={"center"}>
                        <Typography variant="body1" sx={{ mr: 0.4 }}>
                            Search Terms
                        </Typography>
                        <HtmlTooltip title={
                            <Fragment>
                                <Typography color="inherit"><b>Search Terms</b></Typography>
                                <Typography variant="body2">
                                    Phrases that describe a product.<br />
                                    Improves an accuracy of the product search.
                                </Typography>
                            </Fragment>
                        }>
                            <HelpOutlineIcon />
                        </HtmlTooltip>
                    </Box>
                    <Box sx={{mt: 1}}>
                        <EditableList values={props.searchTerms} setValues={props.setSearchTerms} entityName="Search Term" />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}