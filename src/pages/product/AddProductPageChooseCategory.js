import { useState, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";

import useAxios from "../../utils/useAxios";
import ChooseProductCategory from "../../components/Product/ChooseProductCategory";

export default function AddProductPageChooseCategory() {
    const [chosenCategory, setChosenCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);


    const navigate = useNavigate();

    const api = useAxios('products');

    const getCategories = async () => {
        try {
            let response = await api.get("/admin/categories/tree");
            let data = await response.data;
            setCategories(data);
        } catch (err) {
            console.log("Something went wrong!");
        }
    };

    const handleClose = (selectedCategory) => {
        setOpenDialog(false);
        // If there is a selected category, write it into category variable
        if (selectedCategory) {
            setChosenCategory(selectedCategory);
            // You can also do other things with the selected category here
        }
    };

    const isFormValid = () => {
        return !chosenCategory
    };

    const handleSubmit = () => {
        navigate({pathname: '/products/add', search: createSearchParams({"categoryID": chosenCategory._id}).toString()});
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <Box>
            {openDialog && (
                <ChooseProductCategory open={openDialog} setOpen={setOpenDialog} onClose={handleClose} categories={categories} />
            )}
            <Box sx={{ ml: 3, mt: 3 }}>
                <Typography variant="h4">
                    Add Product
                </Typography>
                <Button variant="contained" sx={{ mt: 1 }} color="warning" onClick={() => navigate(-1)}>
                    Go back
                </Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <Box>
                    <Box>
                        <Typography variant="h6">
                            What category will the product be?
                        </Typography>
                    </Box>
                    <Box>
                        <Box sx={{ mt: 1 }}>
                            <Typography sx={{ color: "rgba(0, 0, 0, 0.6)" }} variant="h6">
                                Category:
                            </Typography>
                            <Box display={"flex"}>
                                <Typography variant="subtitle1">
                                    {chosenCategory ? chosenCategory.name : "No category selected"}
                                </Typography>
                                <Button variant="outlined" size="small" sx={{ ml: 2 }}
                                    onClick={() => setOpenDialog(!openDialog)}>
                                    Choose category
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{mt: 2}}>
                        <Button variant="contained" size="small" disabled={isFormValid()} onClick={handleSubmit}>
                            Continue
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}