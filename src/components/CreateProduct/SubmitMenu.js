import { Box, Typography, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export default function SubmitMenu (props) {
    return (
        <Box sx={{padding: 2, width: "85%", ml: "auto"}}>
            <Typography variant="h5" sx={{mb: 1}}>
                You are on submit menu
            </Typography>
            <Typography variant="body1" sx={{mb: 1}}>
                Make sure, that all required product attributes are filled properly and product photos were chosen in the "IMAGES" menu. <br />
                If product has variation, ensure that all required product variation data are filled properly. <br />
                Also make sure that all photos for product variations were chosen in the "IMAGES" menu.<br /><br />
                <b>Note that size of each image must be less than 1 MB.</b>
            </Typography>
            <Typography variant="subtitle1" sx={{mb: 1}}>
                <b>Product has variations: {props.hasVariations ? "Yes": "No"}</b>
            </Typography>
            {props.hasVariations && (
                <Typography variant="subtitle1" sx={{mb: 1}}>
                    Variation count: {props.productVariationCount}
                </Typography>
            )}
            {JSON.stringify(props.errorHandler.obj) !== JSON.stringify({}) && (
                <Alert severity="error" sx={{mb: 1, width: "50%"}}>
                    An Error Happen 
                </Alert>
            )}
            <LoadingButton loading={props.loading} variant="contained" size="small" onClick={props.handleSubmit}>
                Create Product
            </LoadingButton>
        </Box>
    )
}