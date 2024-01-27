import { Paper, Box, IconButton, Button, Alert } from "@mui/material";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { VisuallyHiddenInput } from "../../HiddenInput";
import { range, isValidHttpUrl } from "../../../utils/Services";

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

    const handleChange = (e, secondaryImageToReplace) => {
        /**
         * @param secondaryImageToReplace - Index of the secondary image we want to replace
         */

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
                        img.operationType = "replace";

                        props.setImageOps((prevValues) => {
                            let newReplaceValue = {
                                main: img, secondaryImages: prevValues.replace.secondaryImages
                            };

                            return { ...prevValues, replace: newReplaceValue };
                        });

                        return { ...prevValues, main: img };

                    case "secondary":
                        // If there's no index of the secondary image we want to replace.
                        if (secondaryImageToReplace === undefined || secondaryImageToReplace === null) {
                            // create temporary array to store images
                            let temp = [];

                            for (let i = 0; i < files.length; i++) {
                                // get the current image
                                let file = files[i];

                                // create a URL for the image
                                file.url = URL.createObjectURL(file);
                                file.operationType = "add";

                                // add the image to the temporary array
                                temp.push(file);
                            }

                            props.setImageOps((prevValues) => {
                                // Create a copy of previous values
                                let modifiedImageOps = { ...prevValues };
                                // Unpack previous values in "add" array and new images.
                                modifiedImageOps.add = [...prevValues.add, ...temp];
                                return modifiedImageOps
                            });

                            let modifiedImages = { ...prevValues };
                            let secondaryImages = modifiedImages.secondaryImages;

                            // Unzip previous secondary images if it is not null and add new images
                            modifiedImages.secondaryImages = [...(secondaryImages ? secondaryImages : []), ...temp];

                            // return the updated images state with the new secondary images
                            return modifiedImages;
                        }

                        // get the new secondary images.
                        let newSecondaryImg = files[0];
                        // assign url to the image.
                        newSecondaryImg.url = URL.createObjectURL(newSecondaryImg);
                        newSecondaryImg.operationType = "replace";

                        // Update image operations
                        props.setImageOps((prevValues) => {
                            let oldSecondaryImage = props.images.secondaryImages?.[secondaryImageToReplace];

                            // If image to replace is File, then return previous image operations.
                            if (oldSecondaryImage instanceof File &&
                                oldSecondaryImage.operationType === "add") {

                                newSecondaryImg.operationType = "add";
                                // Create a copy of the image operations
                                let modifiedImageOps = { ...prevValues };
                                // array with insert operations
                                let addOps = modifiedImageOps.add;
                                // Define index of the image in the array with insert operations
                                // by the formula: Specified index - initial length of the array with the secondary images.
                                let addOpsElemIndex = secondaryImageToReplace - props.secondaryImagesLength;
                                // If the index is gt -1
                                if (addOpsElemIndex > -1) {
                                    // then replace image in the array with insert operations
                                    addOps[addOpsElemIndex] = newSecondaryImg;
                                }
                                // assign modified array with the insert operations
                                modifiedImageOps.add = addOps;

                                return modifiedImageOps;
                            }

                            // Array with the all image replacements
                            let secondaryImgReplacementArray = prevValues.replace.secondaryImages;
                            // If secondary images is array
                            if (secondaryImgReplacementArray) {
                                // then, trying to find replacement of the image with the specified index
                                let secondaryImgReplacement = secondaryImgReplacementArray.find(obj => obj.index === secondaryImageToReplace);
                                // if replacement was found
                                if (secondaryImgReplacement) {
                                    // then, get index of replacement
                                    let secondaryImgReplacementIndex = secondaryImgReplacementArray.indexOf(secondaryImgReplacement);
                                    // set a new image for "newImg" property in the replacement
                                    secondaryImgReplacement.newImg = newSecondaryImg;
                                    // set a new replacement on the specified index
                                    secondaryImgReplacementArray[secondaryImgReplacementIndex] = secondaryImgReplacement;

                                    // new value for replace property
                                    let newReplaceValue = {
                                        main: prevValues.replace.main,
                                        secondaryImages: secondaryImgReplacementArray,
                                    };

                                    return { ...prevValues, replace: newReplaceValue };
                                }

                                // initialize a new image replacement
                                let newSecondaryImgReplace = {
                                    source: oldSecondaryImage, // source - URL of the old image
                                    newImg: newSecondaryImg, // newImg - A new image
                                    index: secondaryImageToReplace, // image index
                                };

                                // new value for replace property
                                let newReplaceValue = {
                                    main: prevValues.replace.main,
                                    secondaryImages: [...secondaryImgReplacementArray, newSecondaryImgReplace]
                                };

                                return { ...prevValues, replace: newReplaceValue };
                            }

                            // initialize a new image replacement
                            let newSecondaryImgReplace = {
                                source: oldSecondaryImage, // source - URL of the image to replace
                                newImg: newSecondaryImg, // newImg - A new image
                                index: secondaryImageToReplace, // image index
                            };

                            // new value for replace property
                            let newReplaceValue = {
                                main: prevValues.replace.main,
                                secondaryImages: [newSecondaryImgReplace,]
                            };

                            return { ...prevValues, replace: newReplaceValue };
                        });

                        // Make a copy of images
                        let modifiedImages = { ...prevValues };
                        let secondaryImages = modifiedImages.secondaryImages;
                        secondaryImages[secondaryImageToReplace] = newSecondaryImg;
                        // Unzip previous secondary images if it is not null and add new images
                        modifiedImages.secondaryImages = secondaryImages;
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

    const removeImage = (secImageIndex) => {
        /**
         * @param secImageIndex - index of the secondary image
         */
        props.setImages((prevValues) => {
            // if the specified index is not the index of a previously existing image
            if (!range(0, props.secondaryImagesLength).includes(secImageIndex)) {
                // Defining an index of the same image in the imageOps.add array.
                let indexInAddArray = secImageIndex - props.secondaryImagesLength;
                // make a copy of previous values
                let modifiedImages = { ...prevValues };
                // Remove image at the specified index
                modifiedImages.secondaryImages = modifiedImages
                    .secondaryImages.filter((_, i) => i !== secImageIndex);

                props.setImageOps((prevImgOps) => {
                    // make a copy of previous image operations
                    let modifiedImageOps = { ...prevImgOps };
                    // Remove the same image in the "imageOps.add" array.
                    modifiedImageOps.add = modifiedImageOps
                        .add.filter((_, i) => i !== indexInAddArray);

                    return modifiedImageOps;
                });

                return modifiedImages;
            }

            // Get secondary image at the specified index
            let img = prevValues.secondaryImages[secImageIndex];

            if (isValidHttpUrl(img)) {
                // make a copy of previous values
                let modifiedImages = { ...prevValues };
                // Remove image at the specified index
                modifiedImages.secondaryImages = modifiedImages
                    .secondaryImages.filter((_, i) => i !== secImageIndex);

                props.setImageOps((prevImgOps) => {
                    // make a copy of previous image operations
                    let modifiedImageOps = { ...prevImgOps };
                    // Add image at the specified index to the images that need to be deleted
                    modifiedImageOps.delete = [...modifiedImageOps.delete, img];

                    // If there are replaces of secondary images
                    if (modifiedImageOps.replace.secondaryImages?.length > 0) {
                        // Decrease index in each object where index is gt index specified by the user
                        modifiedImageOps.replace.secondaryImages = modifiedImageOps.replace.secondaryImages.map(obj => {

                            // Decrease index for objects with a greater index
                            if (obj.index > secImageIndex) {
                                obj.index--;
                            }

                            return obj;
                        });
                        
                    }

                    return modifiedImageOps;
                });

                // Decrease initial length of images.secondaryImages by 1 
                props.setSecondaryImagesLength((prevValue) => prevValue - 1);

                return modifiedImages;

            } else if (img instanceof File) {

                // make a copy of previous values
                let modifiedImages = { ...prevValues };
                // Remove image at the specified index
                modifiedImages.secondaryImages = modifiedImages
                    .secondaryImages.filter((_, i) => i !== secImageIndex);

                props.setImageOps((prevImgOps) => {
                    // Find a replacement with the specified image index
                    let imgReplacement = prevImgOps.replace.secondaryImages.find(obj => obj.index === secImageIndex);
                    // Define an index of the replacement
                    // let indexOfReplacement = prevImgOps.replace.secondaryImages.indexOf(imgReplacement);
                    // make a copy of previous image operations
                    let modifiedImageOps = { ...prevImgOps };
                    // remove replace operation for an image with the specified index 
                    modifiedImageOps.replace.secondaryImages = modifiedImageOps.replace.secondaryImages.filter(obj => {
                        // Remove the object with the chosen index
                        if (obj.index === secImageIndex) {
                            return false;
                        }

                        // Decrease index for objects with a greater index
                        if (obj.index > secImageIndex) {
                            obj.index--;
                        }

                        return true;
                    });

                    // Add image at the specified index to the images that need to be deleted
                    modifiedImageOps.delete = [...modifiedImageOps.delete, imgReplacement.source];

                    return modifiedImageOps;
                });

                // Decrease initial length of images.secondaryImages by 1 
                props.setSecondaryImagesLength((prevValue) => prevValue - 1);

                return modifiedImages;
            }

            return prevValues;
        });
    };

    const getImage = (image, imageType) => {

        // if image type is main, then set max height to 120 px, otherwise set max height to 60 px
        let maxHeight = imageType === "main" ? "120px" : "60px";

        // image styles
        let styles = { width: "100%", maxHeight: maxHeight, objectFit: "scale-down" };
        // if image type is secondaryImage, then set min width to 100px 
        if (imageType === "secondaryImage") {
            styles["minWidth"] = "100px";
        }
        // if image has url property
        if (image instanceof File) {
            // return image with src = image.url
            return (<img src={image.url} alt={"Img"}
                style={styles} />);
        }
        // Otherwise return image with the src = image
        return (<img src={image} alt={"Img"}
            style={styles} />);
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
                                    {getImage(props.images.main, "main")}
                                </Box>
                            )}
                            <Button component="label" 
                            variant="contained" 
                            size="small" sx={{ fontSize: 12 }}
                            disabled={props.images.sourceProductId} 
                            onChange={(e) => handleChange(e)}>
                                Upload Main Image
                                <VisuallyHiddenInput name="main" type="file" accept="image/jpeg" />
                            </Button>
                        </Box>
                    </Paper>
                </Box>
                {(props.displayErrors && props.errorHandler) && (
                    <>
                        {props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : props.baseErrorPath),"replace", "main").map((errMsg, index) => (
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
                        <Button component="label" variant="contained" size="small" disabled={props.images.sourceProductId}>
                            Upload New Secondary Images
                            <VisuallyHiddenInput name="secondary" type="file" accept="image/jpeg" multiple onChange={(e) => handleChange(e)} />
                        </Button>
                    </Box>
                    <Box sx={{ display: "flex", mt: 3 }}>
                        {props.images.secondaryImages && (
                            props.images.secondaryImages.map((secImage, secImageIndex) => (
                                <Paper key={secImageIndex} elevation={2} sx={{ position: "relative", display: "inline-block", mr: 3 }}>
                                    <Box>
                                        {getImage(secImage, "secondaryImage")}
                                    </Box>
                                    <Box sx={{ ml: 1 }}>
                                        <IconButton component="label" sx={{ top: -17, right: 5, position: "absolute", padding: 0 }} size="small" disabled={props.images.sourceProductId}>
                                            <CachedOutlinedIcon />
                                            <VisuallyHiddenInput name="secondary" type="file" accept="image/jpeg" onChange={(e) => handleChange(e, secImageIndex)} />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ ml: 1 }}>
                                        <IconButton sx={{ top: -17, right: -17, position: "absolute", padding: 0 }} size="small" disabled={props.images.sourceProductId}
                                            onClick={() => removeImage(secImageIndex)}>
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
                        {Object.keys(props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), "replace", "secondaryImages")).map((errKey, index) => (
                            <Alert icon={false} severity="error" key={index} sx={{ mb: 1 }}>
                                Secondary image №{Number(errKey) + 1 } - {props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), "replace", "secondaryImages", errKey).join(", ")}
                            </Alert>
                        ))}
                        {Object.keys(props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), "add")).map((errKey, index) => (
                            <Alert icon={false} severity="error" key={index} sx={{ mb: 1 }}>
                                Secondary image №{Number(errKey) + 1 + props.secondaryImagesLength} - {props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), "add", errKey).join(", ")}
                            </Alert>
                        ))}
                    </>
                )}
            </Box>
        </Box>
    )
}