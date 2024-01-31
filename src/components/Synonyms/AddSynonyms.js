import { Box, TextField, Paper, Typography, Button, Alert } from "@mui/material";
import { useState, Fragment, useEffect } from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from "react-router-dom";

import EditableList from "../EditableList";
import HtmlTooltip from "../HtmlTooltip";
import SelectValue from "../SelectValue";
import { arrayToMenuItems } from "../../utils/Services";
import useAxios from "../../utils/useAxios";
import ObjectValueExtractor from "../../utils/objectValueExtractor";


export default function AddSynonyms() {
    const [name, setName] = useState('');
    const [mappingType, setMappingType] = useState('equivalent');
    const [mappingTypeChoices, setMappingTypeChoices] = useState(['equivalent', ]);
    const [inputTokens, setInputTokens] = useState([]);
    const [synonyms, setSynonyms] = useState([]);
    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));

    const api = useAxios('products');
    const navigate = useNavigate();

    const getSynonymsCreationEssentials = async () => {
        try {
            let response = await api.get("/admin/synonyms/create");
            let data = await response.data;
            setMappingTypeChoices(data.mappingTypes);
            
        } catch (err) {
            console.log("Something Went Wrong");
        }
    };

    const createSynonyms = async () => {
        try {
            await api.post("/admin/synonyms/create", {
                name: name,
                mappingType: mappingType,
                input: mappingType === 'explicit' ? inputTokens : null,
                synonyms: synonyms,
            });
            navigate(-1);
        } catch (err) {
            console.log(err.response.data);
            let baseErrors = err.response.data?.base_errors;
            setErrorHandler(() => {
                
                if (baseErrors) {
                    return new ObjectValueExtractor(err.response.data.errors, true);
                } else {
                    return new ObjectValueExtractor(err.response.data.detail, false);
                }
            });
        }
    };

    useEffect(() => {
        getSynonymsCreationEssentials();
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <TextField size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errorHandler.isValueExist("name")}
                    helperText={errorHandler.getObjectValue("name")}
                    label={"Synonym Mapping Name"} />
            </Box>
            <Box display={"flex"} alignItems={"center"} sx={{ mb: 2 }}>
                <SelectValue
                    label="Mapping Type"
                    value={mappingType}
                    setValue={setMappingType}
                    menuItems={arrayToMenuItems(mappingTypeChoices)}
                    otherProps={{ minWidth: 225 }}
                    errors={{
                        error: errorHandler.isValueExist("mappingType"),
                        helperText: errorHandler.getObjectValue("mappingType"),
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
            {mappingType === "explicit" && (
                <Box sx={{ mb: 3 }}>
                    {errorHandler.isValueExist("input") && (
                        <Alert severity="error" sx={{mb: 1}}>
                            {errorHandler.getObjectValue("input")}
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
                            <EditableList values={inputTokens} setValues={setInputTokens} entityName="Input token" />
                        </Box>
                    </Paper>
                </Box>
            )}
            <Box sx={{ mb: 3 }}>
                {errorHandler.isValueExist("synonyms") && (
                    <Alert severity="error" sx={{mb: 1}}>
                        {errorHandler.getObjectValue("synonyms")}
                    </Alert>
                )}
                <Paper sx={{ padding: 2 }}>
                    <Box display="flex" alignItems={"center"}>
                        <Typography variant="body1" sx={{ mr: 0.4 }}>
                            Synonyms
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        <EditableList values={synonyms} setValues={setSynonyms} entityName="Synonym" />
                    </Box>
                </Paper>
            </Box>
            <Box sx={{mb: 2}}>
                <Button variant="contained" size="small" onClick={createSynonyms}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}