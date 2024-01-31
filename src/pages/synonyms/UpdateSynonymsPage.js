import { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import UpdateSynonyms from "../../components/Synonyms/UpdateSynonyms";
import DeleteSynonymsDialog from "../../components/Synonyms/DeleteSynonymsDialog";
import ObjectValueExtractor from "../../utils/objectValueExtractor";
import useAxios from "../../utils/useAxios";

export default function UpdateSynonymsPage() {
    const [currentDialog, setCurrenDialog] = useState(null);
    const [loading, setLoading] = useState(false); // State of page loading.
    const [name, setName] = useState('');
    const [mappingType, setMappingType] = useState('equivalent');
    const [mappingTypeChoices, setMappingTypeChoices] = useState(['equivalent',]);
    const [inputTokens, setInputTokens] = useState([]);
    const [synonyms, setSynonyms] = useState([]);
    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));

    const api = useAxios('products');
    const { id } = useParams(); // product id parameter

    const getSynonymById = async () => {
        setLoading(true);
        try {
            let response = await api.get(`/admin/synonyms/${id}`);
            let data = await response.data;
            setMappingTypeChoices(data.creation_essentials.mappingTypes);
            setName(data.synonym.name);
            setMappingType(data.synonym.mappingType);
            setInputTokens(data.synonym.input);
            setSynonyms(data.synonym.synonyms);
        } catch (err) {
            console.log("Something Went Wrong");
        }
        setLoading(false);
    };

    const updateSynonyms = async () => {
        try {
            await api.put(`/admin/synonyms/${id}`, {
                name: name,
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

    const deleteSynonyms = async () => {
        try {
            await api.delete(`/admin/synonyms/${id}`);
            navigate(-1);
        } catch (err) {
            console.log("Something Went Wrong");
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        getSynonymById();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {currentDialog === "deleteSynonym" && (
                <DeleteSynonymsDialog open={currentDialog === "deleteSynonym"} 
                setOpen={setCurrenDialog} 
                handleSubmit={deleteSynonyms}
                />
            )}
            <Box sx={{ ml: 3, mt: 3 }}>
                <Typography variant="h4">
                    Update Synonyms
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Button variant="contained" color="warning" onClick={() => navigate(-1)}>
                        Go back
                    </Button>
                    <Button variant="contained" sx={{ ml: 1 }} 
                    color="error" onClick={() => setCurrenDialog("deleteSynonym")}>
                        Delete Synonym
                    </Button>
                </Box>

            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <UpdateSynonyms
                    name={name} setName={setName}
                    mappingType={mappingType}
                    setMappingType={setMappingType}
                    mappingTypeChoices={mappingTypeChoices}
                    errorHandler={errorHandler}
                    inputTokens={inputTokens} setInputTokens={setInputTokens}
                    synonyms={synonyms} setSynonyms={setSynonyms}
                    handleSubmit={updateSynonyms}
                />
            </Box>
        </Box>
    )
}
