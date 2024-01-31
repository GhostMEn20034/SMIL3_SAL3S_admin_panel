import { Box, TextField, Paper, Typography, Button, Alert } from "@mui/material";
import { Fragment } from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import EditableList from "../EditableList";
import HtmlTooltip from "../HtmlTooltip";
import SelectValue from "../SelectValue";
import { arrayToMenuItems } from "../../utils/Services";


export default function UpdateSynonyms(props) {
        
    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <TextField size="small"
                    value={props.name}
                    onChange={(e) => props.setName(e.target.value)}
                    error={props.errorHandler?.isValueExist("name")}
                    helperText={props.errorHandler?.getObjectValue("name")}
                    label={"Synonym Mapping Name"} />
            </Box>
            <Box display={"flex"} alignItems={"center"} sx={{ mb: 2 }}>
                <SelectValue
                    label="Mapping Type"
                    value={props.mappingType}
                    setValue={props.setMappingType}
                    menuItems={arrayToMenuItems(props.mappingTypeChoices)}
                    otherProps={{ minWidth: 225 }}
                    disabled={true}
                    errors={{
                        error: props.errorHandler?.isValueExist("mappingType"),
                        helperText: props.errorHandler?.getObjectValue("mappingType"),
                    }}
                />
                <Box sx={{ ml: 1 }}>
                    <HtmlTooltip placement="left" title={
                        <Fragment>
                            <Typography color="inherit"><b>Mapping Type</b></Typography>
                            <Typography variant="body2">
                                <b>Explicit</b> mapping type is a way of defining synonyms
                                that allows you to specify a list of synonyms
                                for each input token.
                                For example, you can map “beer” to [“beer”, “brew”, “pint”]
                                and “ale” to [“ale”, “brew”, “pint”] using explicit mapping type.
                                This means that if you search for “beer” or “ale”,
                                you will get the same results as if you searched
                                for any of the synonyms in the list.
                                However, the order of the synonyms matters,
                                as the first synonym in the list will be used as the primary
                                term for scoring and highlighting.
                                You can also use multiple inputs in the input array,
                                which means that you can map more than one token to the same set of synonyms.
                                For example, you can map both “smartphone” and “phone”
                                to [“smartphone”, “phone”, “mobile”, “cellphone”]
                                using explicit mapping type.
                                This means that if you search for “smartphone” or “phone”,
                                you will get the same results as if you searched
                                for any of the synonyms in the list.<br /><br />
                                <b>Equivalent</b> mapping type is a way of defining synonyms
                                that allows you to specify a list of equivalent terms
                                that are interchangeable.
                                For example, you can map [“beer”, “ale”] to each other using equivalent mapping type.
                                This means that if you search for “beer” or “ale”, you will get the same results
                                as if you searched for both terms. The order of the terms does not matter,
                                as Atlas Search will automatically
                                expand the query to include all the synonyms in the list.
                            </Typography>
                        </Fragment>
                    }>
                        <HelpOutlineIcon />
                    </HtmlTooltip>
                </Box>
            </Box>
            {props.mappingType === "explicit" && (
                <Box sx={{ mb: 3 }}>
                    {props.errorHandler?.isValueExist("input") && (
                        <Alert severity="error" sx={{ mb: 1 }}>
                            {props.errorHandler?.getObjectValue("input")}
                        </Alert>
                    )}
                    <Paper sx={{ padding: 2 }}>
                        <Box display="flex" alignItems={"center"}>
                            <Typography variant="body1" sx={{ mr: 0.4 }}>
                                Input Tokens
                            </Typography>
                            <HtmlTooltip title={
                                <Fragment>
                                    <Typography color="inherit"><b>Input Tokens</b></Typography>
                                    <Typography variant="body2">
                                        If the mapping type is "explicit",
                                        you need to specify list of words
                                        that will be mapped to synonyms<br />
                                        <b>Note: If mapping type is "explicit"
                                            you also need to enter input tokens in synonyms</b>
                                    </Typography>
                                </Fragment>
                            }>
                                <HelpOutlineIcon />
                            </HtmlTooltip>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <EditableList values={props.inputTokens} setValues={props.setInputTokens} entityName="Input token" />
                        </Box>
                    </Paper>
                </Box>
            )}
            <Box sx={{ mb: 3 }}>
                {props.errorHandler.isValueExist("synonyms") && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                        {props.errorHandler.getObjectValue("synonyms")}
                    </Alert>
                )}
                <Paper sx={{ padding: 2 }}>
                    <Box display="flex" alignItems={"center"}>
                        <Typography variant="body1" sx={{ mr: 0.4 }}>
                            Synonyms
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        <EditableList values={props.synonyms} setValues={props.setSynonyms} entityName="Synonym" />
                    </Box>
                </Paper>
            </Box>
            <Box sx={{mb: 2}}>
                <Button variant="contained" size="small" onClick={props.handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}