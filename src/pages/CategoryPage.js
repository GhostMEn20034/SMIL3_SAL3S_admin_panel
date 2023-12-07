import { useState, useEffect } from "react";
import { Box, Typography, Pagination, Button } from "@mui/material";
import { useNavigate, createSearchParams, useLocation, Link } from "react-router-dom";
import useAxios from "../utils/useAxios";
import CategoryList from "../components/Category/CategoryList";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const api = useAxios('products');

    const location = useLocation();

    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);

    let page = Number(params.get("page")) || 1;

    const handlePageChange = (event, value) => {
        page = value;
        let params = {
            page: page
        }
        navigate({ pathname: "/categories", search: createSearchParams(params).toString() });
    };

    const getCategories = async () => {
        try {
            let response = await api.get("/admin/categories/", {
                params: {
                    page: page
                }
            });
            let data = await response.data;
            setCategories(data.result);
            setPageCount(data.page_count);
        } catch (error) {
            console.log("Something went wrong");
        }
    };

    useEffect(() => {
        getCategories();
    }, [page]);

    return (
        <>
            <Box sx={{ mb: 2, mt: 2, ml: 3 }}>
                <Typography variant="h4">
                    Category List
                </Typography>
            </Box>
            <Box sx={{ ml: 3, mb: 3 }}>
                <Link to={"add"} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                    <Button variant="contained">
                        Add new category
                    </Button>
                </Link>
            </Box>
            <Box sx={{ px: 3 }}>
                <CategoryList categories={categories} />
            </Box>
            <Box sx={{ mt: 2, ml: 3, mb: 2 }}>
                <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
            </Box>
        </>
    )
}