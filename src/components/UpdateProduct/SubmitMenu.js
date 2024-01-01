import { Box, Typography, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export default function SubmitMenu(props) {
    return (
        <Box sx={{ padding: 2, width: "85%", ml: "auto" }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
                You are on submit menu
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                Make sure, that all required product attributes are filled properly and product photos were chosen in the "IMAGES" menu. <br />
                If product has variation, ensure that all required product variation data are filled properly. <br />
                Also make sure that all photos for the new product variations were chosen in the "IMAGES" menu.<br />
                Make sure you're trying to delete the product variations you want<br />
                <br />
                <b>Note that size of each image must be less than 1 MB.</b>
            </Typography>
            {props.parent && (
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Variation count: {props.productVariationCount}
                </Typography>
            )}
            {props.variationsToDelete.length > 0 && (
                <Box my={1}>
                    <Typography variant="subtitle1">
                        Products that will be deleted:
                    </Typography>
                    <Box mt={1} sx={{width: "85%"}}>
                        {props.variationsToDelete.map((variation, index) => (
                            <Typography variant="subtitle1" key={index}>
                                - {variation.name}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            )}
            {/* {JSON.stringify(props.errorHandler.obj) !== JSON.stringify({}) && (
                <Alert severity="error" sx={{mb: 2, width: "50%"}}>
                    An Error Happen 
                </Alert>
            )} */}
            <LoadingButton loading={props.loading} variant="contained" size="small" onClick={props.handleSubmit}>
                Update Product
            </LoadingButton>
        </Box>
    )
}