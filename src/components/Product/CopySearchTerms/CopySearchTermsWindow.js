import { useState, useEffect, Fragment, forwardRef } from "react";
import {
    Box, Typography, Pagination,
    Button, Autocomplete, TextField,
    Dialog, Slide, AppBar, Toolbar,
    IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import useAxios from "../../../utils/useAxios";
import SearchTermsList from "./SearchTermList";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#000000',
        },
    },
});

export default function CopySearchTermsWindow(props) {
    const [searchTermInputValue, setSearhTermInputValue] = useState('');
    const [searchTerms, setSearchTerms] = useState([]);
    const [checked, setChecked] = useState([]);
    const [page, setPage] = useState(1);

    const [pageCount, setPageCount] = useState(1);

    const api = useAxios('products');

    const handleClose = () => {
        props.setOpen(null);
    };

    const handlePageChange = (_, value) => {
        setPage(value);
    };

    const handleCheck = (searchTerm) => {
        if (!searchTerm) {
            return;
        }

        setChecked((prevValues) => {
            if (prevValues.some(element => element._id === searchTerm._id)) {
                return prevValues.filter((prevValue) => prevValue._id !== searchTerm._id);
            }
            return [...prevValues, searchTerm];
        });
    };

    const handleCheckAll = () => {
        // define a function that handles the select all option
        if (checked.length === searchTerms.length) {
            // if the checked array has the same length as the objects array
            setChecked([]); // clear the checked array
        } else {
            // Otherwise
            setChecked(searchTerms.map(searchTerm => searchTerm)); // fill the checked array with all indexes
        }
    };

    const getSearchTerms = async () => {
        let params = {
            page: page
        }

        if (searchTermInputValue.length > 0) {
            params.name = searchTermInputValue;
        }

        try {
            let response = await api.get("/admin/search-terms/", {
                params: params,
            });
            let data = await response.data;
            setSearchTerms(data.result);
            setPageCount(data.page_count);
            if (data.page_count < page) {
                setPage(1);
            }

        } catch (error) {
            console.log("Something went wrong");
        }
    };

    const handleSubmit = () => {
        props.setSearchTerms((prevValues) => {
            let newFilteredSearchTerms = checked.filter((newSearchTerm) => !prevValues.includes(newSearchTerm.name));
            let searchTerms = newFilteredSearchTerms.map((searchTerm) => searchTerm.name);
            return [...prevValues, ...searchTerms];
        });
        handleClose(null);
    };

    useEffect(() => {
        getSearchTerms();
    }, [page]);

    return (
        <Fragment>
            <Dialog
                fullScreen
                open={props.open}
                onClose={props.handleClose}
                TransitionComponent={Transition}
            >
                <ThemeProvider theme={theme}>
                    <AppBar sx={{ position: 'relative', backgroundColor: "black" }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                                sx={{ color: "#D5D507" }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1, color: "#D5D507" }} variant="h6" component="div">
                                Copy Search Terms to Product
                            </Typography>
                            <Button
                                autoFocus
                                color="inherit"
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ color: "black", backgroundColor: '#D5D507', ":hover": { backgroundColor: "#b8b804" } }}
                            >
                                Submit
                            </Button>
                        </Toolbar>
                    </AppBar>
                </ThemeProvider>
                <Box>
                    <Box display="flex" alignItems={"center"} sx={{ ml: 3, mb: 3 }}>
                        <Box display={"flex"} alignItems={"center"} sx={{ ml: 2, mt: 4 }}>
                            {checked.length > 0 && (
                                <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
                                    <Typography variant="body1">
                                        {checked.length} search terms chosen
                                    </Typography>
                                </Box>
                            )}
                            <Box>
                                <Autocomplete
                                    sx={{ minWidth: 325 }}
                                    size="small"
                                    freeSolo
                                    id="free-solo-2-demo"
                                    disableClearable
                                    inputValue={searchTermInputValue}
                                    onInputChange={(_, newInputValue) => {
                                        setSearhTermInputValue(newInputValue);
                                    }}
                                    options={[].map((option) => option)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Find Search Terms"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={getSearchTerms}
                                    sx={{ maxWidth: 50 }}
                                >
                                    Search
                                </Button>
                            </Box>
                        </Box>

                    </Box>
                    <Box sx={{ px: 3 }}>
                        <SearchTermsList
                            searchTerms={searchTerms}
                            checked={checked}
                            handleCheck={handleCheck}
                            checkAll={handleCheckAll}
                        />
                    </Box>
                    <Box sx={{ mt: 2, ml: 3, mb: 2 }}>
                        <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
    )
}