import { Box, Button, Typography } from "@mui/material";
import useAxios from "../../utils/useAxios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CategoryDetail from "../../components/Category/CategoryDetail";
import CategoryEdit from "../../components/Category/CategoryEdit";
import CategoryDelete from "../../components/Category/CategoryDelete";

export default function CategoryDetailPage() {

    const [category, setCategory] = useState({});
    const [categoriesForChoices, setCategoriesForChoices] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState("");

    const api = useAxios('products');

    const navigate = useNavigate();

    const params = useParams();

    const goBack = () => {
        navigate(-1);
    };

    const getCategoryById = async () => {
        try {
            let response = await api.get(`/admin/categories/${params.id}`);
            let data = await response.data;
            setCategory(data);
        } catch (error) {
            console.log(error.response.details);
        }
    };

    const getCategories = async () => {
        try {
            let response = await api.get(`/admin/categories/for-choices`);
            let data = await response.data;
            setCategoriesForChoices(data.filter((obj) => obj._id !== params.id));
        } catch {
            console.log("Something went wrong");
        }
    };

    const deleteCategory = async () => {
        try {
            await api.delete(`/admin/categories/${category._id}`);
            navigate(-1);
        } catch (error) {
            setError(error.response.data.detail)
        }
    };

    useEffect(() => {
        getCategoryById();
    }, []);

    useEffect(() => {
        getCategories();
    }, []);


    return (
        <>  
            {category && (
                <>
                    <Box display={"flex"}>
                        {openDialog && (
                            <CategoryDelete open={openDialog} setOpen={setOpenDialog} 
                            onSubmit={deleteCategory} error={error} setError={setError} />
                        )}
                        <Box>
                            <Box sx={{ mt: 5, ml: 5}}>
                                <Typography variant="h5">
                                    Detail info of {category.name}
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 5, ml: 5 }}>
                                <Button variant="contained" size="small" color="warning" onClick={goBack}>Go back</Button>
                            </Box>
                            <Box sx={{ mt: 2, ml: 5 }}>
                                <Button variant="contained" size="small" onClick={() => setEditMode(!editMode)}>{editMode ? "Go to detail view" : "Edit"}</Button>
                            </Box>
                            <Box sx={{ mt: 2, ml: 5 }}>
                                <Button variant="contained" color="error" size="small" onClick={() => setOpenDialog(true)}>Delete Category</Button>
                            </Box>
                        </Box>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: 4, width: "600px" }}>
                            {editMode ? (
                                <CategoryEdit category={category} categoriesForChoices={categoriesForChoices} />
                            ) : (
                                <CategoryDetail category={category} categoriesForChoices={categoriesForChoices} />
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </>
    )
}