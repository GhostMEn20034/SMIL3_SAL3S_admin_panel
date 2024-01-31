import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryAdd from "../../components/Category/CategoryAdd";

export default function AddCategoryPage() {

    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ ml: 3, mt: 3 }}>
                <Typography variant="h4">
                    Add Category
                </Typography>
                <Button variant="contained" sx={{mt: 1}} color="warning" onClick={() => navigate(-1)}>
                    Go back
                </Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <CategoryAdd />
            </Box>
        </Box>
    )
}
