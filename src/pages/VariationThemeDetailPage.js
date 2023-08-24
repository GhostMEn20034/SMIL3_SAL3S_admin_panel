import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import VariationThemeDetail from "../components/VariationThemeComponents/VariationThemeDetail";
import VariationThemeEdit from "../components/VariationThemeComponents/VariationThemeEdit";

export default function VariationThemeDetailPage() {
    const [variationTheme, setVariationTheme] = useState({});
    const [categories, setCategories] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const api = useAxios('products');
    const navigate = useNavigate();
    const params = useParams();

    const goBack = () => {
        navigate(-1);
    };

    const getCategories = async () => {
        try {
            let response = await api.get(`/categories/`);
            let data = await response.data;
            setCategories(data);
        } catch {
            console.log("Something went wrong");
        }
    };


    const getVariationThemeById = async () => {
        try {
            let response = await api.get(`variation-themes/${params.id}`);
            let data = await response.data;
            setVariationTheme(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getVariationThemeById();

    }, []);

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            {variationTheme && categories && (
                <Box display={"flex"}>
                    <Box>
                        <Box sx={{ mt: 5, ml: 5 }}>
                            <Button variant="contained" size="small" color="warning" onClick={goBack}>Go back</Button>
                        </Box>
                        <Box sx={{ mt: 2, ml: 5 }}>
                            <Button variant="contained" size="small" onClick={() => setEditMode(!editMode)}>{editMode ? "Go to detail view" : "Edit"}</Button>
                        </Box>
                        <Box sx={{ mt: 2, ml: 5 }}>
                            <Button variant="contained" color="error" size="small">Delete Facet</Button>
                        </Box>
                    </Box>

                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: 4, ml: "30vh", width: "600px" }} >
                        {editMode ? (
                            <VariationThemeEdit variationTheme={variationTheme} categories={categories} />
                        ) : (
                            <VariationThemeDetail variationTheme={variationTheme} categories={categories} />
                        )}
                    </Box>

                </Box>
            )}
        </>
    )
}