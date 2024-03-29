import { useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import VariationThemeDetail from "../../components/VariationTheme/VariationThemeDetail";
import VariationThemeEdit from "../../components/VariationTheme/VariationThemeEdit";
import VariationThemeDelete from "../../components/VariationTheme/VariationThemeDelete";

export default function VariationThemeDetailPage() {
    const [variationTheme, setVariationTheme] = useState({});
    const [categories, setCategories] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState(null);

    const api = useAxios('products');
    const navigate = useNavigate();
    const params = useParams();

    const goBack = () => {
        navigate(-1);
    };

    const getCategories = async () => {
        try {
            let response = await api.get(`/admin/categories/for-choices`);
            let data = await response.data;
            setCategories(data);
        } catch {
            console.log("Something went wrong");
        }
    };


    const getVariationThemeById = async () => {
        try {
            let response = await api.get(`/admin/variation-themes/${params.id}`);
            let data = await response.data;
            setVariationTheme(data);
        } catch (error) {
            console.log("Something went wrong");
        }
    };

    useEffect(() => {
        getVariationThemeById();

    }, []);

    useEffect(() => {
        getCategories();
    }, []);

    const deleteVariationTheme = async () => {
        try {
            await api.delete(`/admin/variation-themes/${params.id}`);
            navigate(-1);
        } catch (err) {
            setError(err.response.data.detail);
        }
    };

    return (
        <>
            {openDialog && (
                <VariationThemeDelete open={openDialog} setOpen={setOpenDialog} onSubmit={deleteVariationTheme} error={error} setError={setError} />
            )}
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
                            <Button variant="contained" color="error" size="small" onClick={setOpenDialog}>Delete Variation Theme</Button>
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