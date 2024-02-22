import { useState, useEffect } from "react";
import { Box, Typography, Pagination, Button } from "@mui/material";
import { useNavigate, createSearchParams, useLocation, Link } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import SearchTermsList from "../../components/SearchTerm/SearchTermList";
import DeleteManySearchTermsDialog from "../../components/SearchTerm/DeleteManySearchTermsDialog";

export default function SearchTermsPage() {
    const [searchTerms, setSearchTerms] = useState([]);
    const [checked, setChecked] = useState([]);

    const [pageCount, setPageCount] = useState(1);

    const [currentDialog, setCurrentDialog] = useState(null);

    const api = useAxios('products');

    const location = useLocation();

    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);

    let page = Number(params.get("page")) || 1;

    const handlePageChange = (_, value) => {
        page = value;
        let params = {
            page: page
        }
        navigate({ pathname: "/search-terms", search: createSearchParams(params).toString() });
    };

    const handleCheck = (searchTermId) => {
        if (!searchTermId) {
            return;
        }

        setChecked((prevValues) => {
            if (prevValues.includes(searchTermId)) {
                return prevValues.filter((prevValue) => prevValue !== searchTermId);
            }
            return [...prevValues, searchTermId];
        });
    };

    const handleCheckAll = () => {
        // define a function that handles the select all option
        if (checked.length === searchTerms.length) {
            // if the checked array has the same length as the objects array
            setChecked([]); // clear the checked array
        } else {
            // Otherwise
            setChecked(searchTerms.map(searchTerm => searchTerm._id)); // fill the checked array with all indexes
        }
    };

    const getSearchTerms = async () => {
        try {
            let response = await api.get("/admin/search-terms/", {
                params: {
                    page: page
                }
            });
            let data = await response.data;
            setSearchTerms(data.result);
            setPageCount(data.page_count);
            setChecked([]);
        } catch (error) {
            console.log("Something went wrong");
        }
    };

    const deleteChosenSearchTerms = async () => {
        try {
            await api.delete("/admin/search-terms/", {
                data: {
                    search_terms_ids: checked
                }
            });
            getSearchTerms();
            setCurrentDialog(null);
            setChecked([]);
        } catch (err) {
            console.log("Something Went wrong");
        }
    };

    useEffect(() => {
        getSearchTerms();
    }, [page]);

    return (
        <>
            {currentDialog === 'deleteSearchTerms' && (
                <DeleteManySearchTermsDialog
                    open={currentDialog === 'deleteSearchTerms'}
                    setOpen={setCurrentDialog}
                    handleSubmit={deleteChosenSearchTerms}
                />
            )}
            <Box sx={{ mb: 2, mt: 2, ml: 3 }}>
                <Typography variant="h4">
                    Search Terms List
                </Typography>
            </Box>
            <Box display="flex" sx={{ ml: 3, mb: 3 }}>
                <Box>
                    <Link to={"add"} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <Button variant="contained" size="small">
                            Add New Search Term
                        </Button>
                    </Link>
                </Box>
                <Box sx={{ ml: 2 }}>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        disabled={checked.length < 1}
                        onClick={() => setCurrentDialog('deleteSearchTerms')}
                    >
                        Delete Search Terms
                    </Button>
                </Box>
                {checked.length > 0 && (
                    <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
                        <Typography variant="body1">
                            {checked.length} search terms chosen
                        </Typography>
                    </Box>
                )}
            </Box>
            <Box sx={{ px: 3 }}>
                <SearchTermsList searchTerms={searchTerms} checked={checked} handleCheck={handleCheck} checkAll={handleCheckAll} />
            </Box>
            <Box sx={{ mt: 2, ml: 3, mb: 2 }}>
                <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
            </Box>
        </>
    )
}