import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

import UpdateSearchTerms from "../../components/SearchTerm/UpdateSearchTerm";
import useAxios from "../../utils/useAxios";
import ObjectValueExtractor from "../../utils/objectValueExtractor";
import DeleteSearchTermDialog from "../../components/SearchTerm/DeleteSearchTermDialog";


export default function UpdateSearchTermPage() {
    dayjs.extend(utc);

    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false);

    const [name, setName] = useState(null);
    const [searchCount, setSearchCount] = useState(null);
    const [lastSearched, setLastSearched] = useState(null);

    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));
    const [currentDialog, setCurrentDialog] = useState(null);

    const navigate = useNavigate();
    const api = useAxios('products');

    const { id } = useParams(); // product id parameter

    const getSearchTermById = async () => {
        setLoading(true);
        try {
            let response = await api.get(`/admin/search-terms/${id}`);
            let data = await response.data;
            setName(data.search_term.name);
            setSearchCount(data.search_term.search_count);
            setLastSearched(dayjs(data.search_term.last_searched));
        } catch (err) {
            console.log("Something went wrong");
            navigate(-1);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            await api.put(`/admin/search-terms/${id}`, {
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

    const handleDelete = async () => {
        try {
            await api.delete(`/admin/search-terms/${id}`);
            navigate(-1);
        } catch (e) {
            console.log("Something Went Wrong");
        }
    }

    useEffect(() => {
        getSearchTermById();
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
            {currentDialog === 'deleteSearchTerm' && (
                <DeleteSearchTermDialog
                    open={currentDialog === 'deleteSearchTerm'}
                    setOpen={setCurrentDialog}
                    name={name}
                    handleSubmit={handleDelete}
                />
            )}
            <Box sx={{ ml: 3, mt: 3 }}>
                <Typography variant="h4">
                    Update Search Term
                </Typography>
                <Box>
                    <Button variant="contained" sx={{ mt: 1 }} color="warning" onClick={() => navigate(-1)}>
                        Go back
                    </Button>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        color="error"
                        onClick={() => setCurrentDialog('deleteSearchTerm')}
                    >
                        Delete Search Term
                    </Button>
                </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <UpdateSearchTerms
                    name={name} setName={setName}
                    errorHandler={errorHandler}
                    searchCount={searchCount}
                    lastSearched={lastSearched}
                />
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