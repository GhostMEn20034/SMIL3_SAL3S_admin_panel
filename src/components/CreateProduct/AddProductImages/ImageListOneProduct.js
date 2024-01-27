import { Paper, Box, IconButton, Button, Typography, Alert } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { VisuallyHiddenInput } from "../../HiddenInput";

export default function ImageListOneProduct(props) {
    /**
    * Renders form to upload images for product that has no variations.
    * List of props:
    * ------------------------------------------------------------------------
    * images - array of files, state of images for product without variations
    * setImages - react setState function for images variable
    * displayErrors - boolean, determines whether component should display errors.
    * errorHandler - class that returns errors
    * baseErrorPath - Base path to the error, used by the function that finds an error. Suppose your value located in the key images[secondary][1], 
    * in this case you can consider "images" key as base path.
    */

    const handleChange = (e) => {
        props.setImages((prevValues) => {
            // get all the files from the input element
            let files = e.target.files;

            // get the name of the input element
            let name = e.target.name;

            if (files.length > 0) {
                switch (name) {
                    case "main":
                        // get the first image
                        let img = files[0];

                        // assign url to the image
                        img.url = URL.createObjectURL(img);

                        return { ...prevValues, main: img };

                    case "secondary":
                        // create temporary array to store images
                        let temp = [];

                        for (let i = 0; i < files.length; i++) {
                            // get the current image
                            let file = files[i];

                            // create a URL for the image
                            file.url = URL.createObjectURL(file);

                            // add the image to the temporary array
                            temp.push(file);
                        }

                        let modifiedImages = { ...prevValues };
                        let secondaryImages = modifiedImages.secondaryImages;

                        // Unzip previous secondary images if it is not null and add new images
                        modifiedImages.secondaryImages = [...(secondaryImages ? secondaryImages : []), ...temp];

                        // return the updated images state with the new secondary images
                        return modifiedImages;

                    default:
                        // do nothing and return the previous state
                        return prevValues;
                }
            }

            return prevValues;
        });
    };

    const removeImage = (name, secImageIndex) => {
        /**
         * @param name - event.target.name, for this function it can be "main" or "secondary"
         * @param secImageIndex - index of the secondary image
         */
        props.setImages((prevValues) => {
            switch (name) {
                case "main":
                    return { ...prevValues, main: null };

                case "secondary":
                    let modifiedImages = { ...prevValues };
                    let secondaryImages = modifiedImages.secondaryImages;
                    secondaryImages.splice(secImageIndex, 1);

                    if (secondaryImages.length === 0) {
                        modifiedImages.secondaryImages = null;
                    }

                    return modifiedImages;

                default:
                    // do nothing and return the previous state
                    return prevValues;
            }
        });
    };

    return (
        <Box display={"flex"}>
            <Box>
                <Box display={"flex"} mb={2}>
                    <Paper elevation={3} sx={{ height: "175px", width: "175px" }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                height: "90%",
                                padding: 1
                            }}
                        >
                            {props.images.main && (
                                <Box>
                                    <img src={props.images.main.url} alt={"Img"}
                                        style={{ width: "100%", maxHeight: "120px", objectFit: "scale-down" }} />

                                </Box>
                            )}
                            <Button component="label" variant="contained" size="small" sx={{ fontSize: 12 }} onChange={(e) => handleChange(e)}>
                                Upload Main Image
                                <VisuallyHiddenInput name="main" type="file" accept="image/jpeg" />
                            </Button>
                        </Box>
                    </Paper>
                    <IconButton sx={{ alignSelf: "start" }} onClick={() => removeImage("main")}>
                        <DeleteForeverIcon />
                    </IconButton>
                </Box>
                {(props.displayErrors && props.errorHandler) && (
                    <>
                        {props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), "main").map((errMsg, index) => (
                            <Alert icon={false} severity="error" key={index}>
                                {errMsg}
                            </Alert>
                        ))}
                    </>
                )}
            </Box>
            <Box sx={{ ml: 4 }}>
                <Paper elevation={3} sx={{ height: "175px", minWidth: "400px", px: 2, mb: 2 }}>
                    <Box sx={{ height: "40%", width: "100%", display: "flex", justifyContent: "center", alignItems: "end" }}>
                        <Button component="label" variant="contained" size="small">
                            Upload Secondary Images
                            <VisuallyHiddenInput name="secondary" type="file" accept="image/jpeg" multiple onChange={(e) => handleChange(e)} />
                        </Button>
                    </Box>
                    <Box sx={{ display: "flex", mt: 3 }}>
                        {props.images.secondaryImages && (
                            props.images.secondaryImages.map((secImage, secImageIndex) => (
                                <Paper key={secImageIndex} elevation={2} sx={{ position: "relative", display: "inline-block", mr: 3 }}>
                                    <Box>
                                        <img src={secImage.url} key={secImageIndex} alt={"Img"}
                                            style={{ minWidth: "100px", width: "100%", maxHeight: "60px", objectFit: "scale-down" }} />
                                    </Box>
                                    <Box sx={{ ml: 1 }}>
                                        <IconButton sx={{ top: -17, right: -17, position: "absolute", padding: 0 }} size="small"
                                            onClick={() => removeImage("secondary", secImageIndex)}>
                                            <HighlightOffRoundedIcon />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))
                        )}
                    </Box>
                </Paper>
                {(props.displayErrors && props.errorHandler) && (
                    <>
                        {Object.keys(props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), "secondaryImages")).map((errKey, index) => (
                            <Alert icon={false} severity="error" key={index} sx={{ mb: 1 }}>
                                Secondary image №{index + 1} - {props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : props.baseErrorPath), "secondaryImages", errKey).join(", ")}
                            </Alert>
                        ))}
                    </>
                )}
            </Box>
        </Box>
    )
}