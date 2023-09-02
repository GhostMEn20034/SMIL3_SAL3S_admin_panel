import { useState } from "react";
import useAxios from "../../utils/useAxios";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import SelectValue from "../SelectValue";
import { useNavigate } from "react-router-dom";

export default function CategoryEdit({ category, categoriesForChoices }) {
    const [name, setName] = useState(category.name);
    const [parent, setParent] = useState(category.parent_id);
    const [errors, setErrors] = useState([]);
    const [specificError, setSpecificError] = useState("");

    const api = useAxios('products');
    const navigate = useNavigate();


    const updateCategory = async () => {
        try {
            await api.put(`/categories/${category._id}`, {
                name: name,
                parent_id: parent
            });
            navigate(-1);
        } catch (error) {
            if (error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setSpecificError(error.response.data.detail);
            }
        }
    };

    return (
        <>
            <Box>
                <Box>
                    <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" size="small"
                        error={errors.name !== undefined} helperText={errors.name ? errors.name : ""} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SelectValue value={parent} setValue={setParent} menuItems={[
                        { name: "No parent", _id: null },
                        ...categoriesForChoices
                    ]}
                        label="Parent" size="small" objectKey={"_id"} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        * Empty value means that category has no parent
                    </Typography>
                </Box>
                {specificError && (
                    <Box sx={{mt: 1}}>
                        <Alert severity="error" onClose={() => setSpecificError("")}>
                            {specificError}
                        </Alert>
                    </Box>
                )}
                <Box sx={{ mt: 1 }}>
                    <Button variant="contained" color="primary"
                        onClick={updateCategory}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </>
    )
}
