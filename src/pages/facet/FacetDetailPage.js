import { Box, Button } from "@mui/material";
import useAxios from "../../utils/useAxios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FacetDetail from "../../components/Facet/FacetDetail";
import FacetEdit from "../../components/Facet/FacetEdit";
import FacetDelete from "../../components/Facet/FacetDelete";

export default function FacetDetailPage() {

    const [facet, setFacet] = useState({});
    const [categories, setCategories] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const api = useAxios('products');

    const navigate = useNavigate();

    const params = useParams();

    const goBack = () => {
        navigate(-1);
    };

    const getFacetById = async () => {
        try {
            let response = await api.get(`/admin/facets/${params.id}`);
            let data = await response.data;
            setFacet(data);
        } catch (error) {
            console.log(error.response.details);
        }
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

    const deleteFacet = async () => {
        try {
            await api.delete(`/admin/facets/${facet._id}`);
            navigate(-1);
        } catch (error) {

        }
    };

    useEffect(() => {
        getFacetById();
    }, []);

    useEffect(() => {
        getCategories();
    }, []);


    return (
        <>
            {openDialog && (
                <FacetDelete open={openDialog} setOpen={setOpenDialog} onSubmit={deleteFacet} />
            )}
            {facet && categories && (
                <>
                    <Box display={"flex"}>
                        <Box>
                            <Box sx={{ mt: 5, ml: 5 }}>
                                <Button variant="contained" size="small" color="warning" onClick={goBack}>Go back</Button>
                            </Box>
                            <Box sx={{ mt: 2, ml: 5 }}>
                                <Button variant="contained" size="small" onClick={() => setEditMode(!editMode)}>{editMode ? "Go to detail view" : "Edit"}</Button>
                            </Box>
                            <Box sx={{ mt: 2, ml: 5 }}>
                                <Button variant="contained" color="error" size="small" onClick={() => setOpenDialog(!openDialog)}>Delete Facet</Button>
                            </Box>
                        </Box>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: 4, ml: "30vh", width: "600px" }}>
                            {editMode ? (
                                <FacetEdit facet={facet} categories={categories} />
                            ) : (
                                <FacetDetail facet={facet} categories={categories} />
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </>
    )
}