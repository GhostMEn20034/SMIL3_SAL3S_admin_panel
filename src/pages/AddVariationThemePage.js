import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddVariationTheme from "../components/VariationTheme/AddVariationTheme";

export default function AddVariationThemePage() {

    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ ml: 3, mt: 3 }}>
                <Typography variant="h4">
                    Add Variation Theme
                </Typography>
                <Button variant="contained" sx={{mt: 1}} color="warning" onClick={() => navigate(-1)}>
                    Go back
                </Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <AddVariationTheme />
            </Box>
        </Box>
    )
}