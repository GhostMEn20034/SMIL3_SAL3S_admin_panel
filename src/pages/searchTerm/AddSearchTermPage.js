import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import AddSearchTerm from "../../components/SearchTerm/AddSearchTerm";
import useAxios from "../../utils/useAxios";
import ObjectValueExtractor from "../../utils/objectValueExtractor";

export default function AddSearchTermPage() {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [name, setName] = useState('');
    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));

    const navigate = useNavigate();
    const api = useAxios('products');

    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            await api.post('/admin/search-terms/', {
                name: name,
            });
            navigate(-1);
        } catch (err) {
            let baseErrors = err.response.data?.base_errors;
            setErrorHandler(() => {
                if (baseErrors) {
                    return new ObjectValueExtractor(err.response.data.errors, true);
                } else {
                    return new ObjectValueExtractor(err.response.data.detail, false);
                }
            });
        }
        setSubmitLoading(false);
    };


    return (
        <Box>
            <Box sx={{ ml: 3, mt: 3 }}>
                <Typography variant="h4">
                    Add Search Term
                </Typography>
                <Button variant="contained" sx={{ mt: 1 }} color="warning" onClick={() => navigate(-1)}>
                    Go back
                </Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <AddSearchTerm name={name} setName={setName} errorHandler={errorHandler} />
            </Box>
            <Box sx={{ my: 3 }} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <LoadingButton loading={submitLoading}
                variant="contained" size="small" onClick={handleSubmit}>
                    Submit
                </LoadingButton>
            </Box>
        </Box>
    );
}