import { Box, Paper, IconButton, Typography, Button, Alert } from "@mui/material";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { VisuallyHiddenInput } from "../../HiddenInput";
import { Fragment } from "react";
import SelectValue from "../../SelectValue";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Link } from "react-router-dom";


export default function ImageListMultipleProducts(props) {
    /**
    * Renders form to upload images for product that has variations.
    * List of props:
    * ------------------------------------------------------------------------
    * productVariations - array of objects, state of productVariations
    * setProductVariations - react setState function for productVariations
    * hasVariations - boolean, determines whether product has variaitions
    * displayErrors - boolean, determines whether component should display errors.
    * errorHandler - class that returns errors
    * baseErrorPath - Base path to the error, used by the function that finds an error. Suppose your value located in the key images[secondary][1], 
    * in this case you can consider "images" key as base path.
    */
    const handleChange = (e, index) => {
        /**
         * @param e - event
         * @param index - index of the product variation
         */
        props.setProductVariations((prevValues) => {
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

                        return prevValues.map((product, i) => {
                            // if product index equals to the index passed into the function, then modify product images
                            if (i === index) {
                                let modifiedImages = { ...product.images };
                                modifiedImages.main = img;
                                return { ...product, images: modifiedImages };
                            }

                            // Else return original product
                            return product;
                        });

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

                        // return the updated images state with the new secondary images
                        return prevValues.map((product, i) => {

                            // if product index equals to the index passed into the function, then modify product images
                            if (i === index) {
                                let modifiedImages = { ...product.images };
                                let secondaryImages = modifiedImages.secondaryImages;
                                // Unzip previous secondary images if it is not null and add new images
                                modifiedImages.secondaryImages = [...(secondaryImages ? secondaryImages : []), ...temp];
                                return { ...product, images: modifiedImages };
                            }
                            // Else return original product
                            return product;
                        });

                    default:
                        // do nothing and return the previous state
                        return prevValues;
                }
            }

            return prevValues;
        });
    };

    const removeImage = (index, name, secImageIndex) => {
        /**
         * @param index - index of the product variation
         * @param name - event.target.name, for this function it can be "main" or "secondary"
         * @param secImageIndex - index of the secondary image
         */
        props.setProductVariations((prevValues) => {
            // Do function need to reset sourceProductIds
            let resetImageSources = false;

            switch (name) {
                case "main":        
                    // Remove main image on the specified index
                    prevValues = prevValues.map((product, i) => {
                        // if product index equals to the index passed into the function, then remove main image
                        if (i === index) {
                            let modifiedImages = { ...product.images };
                            URL.revokeObjectURL(modifiedImages.main?.url);
                            modifiedImages.main = null;
                            // If there are no product images
                            if (!modifiedImages.main && !modifiedImages.secondaryImages) {
                                // then function should remove sourceProductId from all images where
                                // images.sourceProductId is equal to specified index
                                resetImageSources = true;
                            }

                            return { ...product, images: modifiedImages };
                        }
                        // Else return original product
                        return product;
                    });
                    // If resetImageSources is True
                    if (resetImageSources) {
                        // then remove image source from each product
                        // where images.sourceProductId is equal to the specified index
                        prevValues = prevValues.map((product) => {
                            if (product.images?.sourceProductId === index) {
                                let modifiedImages = { ...product.images };
                                modifiedImages.sourceProductId = null;
                                return { ...product, images: modifiedImages };
                            }

                            return product;
                        });
                    }

                    return prevValues

                case "secondary":
                    prevValues = prevValues.map((product, i) => {
                        // if product index equals to the index passed into the function, 
                        // then remove image in the secondaryImages array
                        if (i === index) {
                            let modifiedImages = { ...product.images };
                            let secondaryImages = modifiedImages.secondaryImages;
                            URL.revokeObjectURL(secondaryImages[secImageIndex]?.url);
                            secondaryImages.splice(secImageIndex, 1);
                            // if there is no images in secondaryImages array
                            // then assign null to secondaryImages
                            if (secondaryImages.length === 0) {
                                modifiedImages.secondaryImages = null;
                            }
                            // If there are no product images
                            if (!modifiedImages.main && !modifiedImages.secondaryImages) {
                                // then function should remove sourceProductId from all images where
                                // images.sourceProductId is equal to specified index
                                resetImageSources = true;
                            }

                            return { ...product, images: modifiedImages };
                        }

                        // Else return original product
                        return product;
                    });

                    // If resetImageSources is True
                    if (resetImageSources) {
                        // then remove image source from each product
                        // where images.sourceProductId is equal to the specified index
                        prevValues = prevValues.map((product) => {
                            if (product.images?.sourceProductId === index) {
                                let modifiedImages = { ...product.images };
                                modifiedImages.sourceProductId = null;
                                return { ...product, images: modifiedImages };
                            }

                            return product;
                        });
                    }

                    return prevValues

                default:
                    // do nothing and return the previous state
                    return prevValues;
            }
        });
    };
    // Component that renders images
    const Imgs = ({ index, imageType = "main" }) => {
        // get an object with images in the product at the specified index
        let variationImages = props.productVariations[index].images;
        // if image type is secondaryImage
        if (imageType === "secondaryImages") {
            let images;
            // if there is a source of images
            if (typeof variationImages.sourceProductId === "number") {
                // Then try to get images from the product that is source of images
                images = props.productVariations[variationImages.sourceProductId].images.secondaryImages;
            } else {
                // Otherwise get product's own images, not from the source ID
                images = variationImages.secondaryImages;
            }

            return (
                <>
                    {images && (
                        images.map((secImage, secImageIndex) => (
                            <Paper key={secImageIndex} elevation={2} sx={{ position: "relative", display: "inline-block", mr: 3 }}>
                                <Box>
                                    <img src={secImage instanceof File ? secImage.url : secImage} key={secImageIndex} alt={"Img " + (secImageIndex + 1)}
                                        style={{ minWidth: "100px", width: "100%", maxHeight: "60px", objectFit: "scale-down" }} />
                                </Box>
                                <Box sx={{ ml: 1 }}>
                                    <IconButton sx={{ top: -17, right: -17, position: "absolute", padding: 0 }}
                                        size="small"
                                        onClick={() => removeImage(index, "secondary", secImageIndex)}
                                        disabled={typeof variationImages.sourceProductId === "number"}
                                    >
                                        <HighlightOffRoundedIcon />
                                    </IconButton>
                                </Box>
                            </Paper>
                        ))
                    )}
                </>
            )
        }

        // If image type is "main"
        let image;
        // if there is a source of images
        if (typeof variationImages.sourceProductId === "number") {
            // Then try to get image from the product that is source of images
            image = props.productVariations[variationImages.sourceProductId].images.main;
        } else {
            // Otherwise get product's own image, not from the source ID
            image = variationImages.main;
        }

        return (
            <>
                {image && (
                    <Box>
                        <img src={image instanceof File ? image.url : image} alt={props.productVariations[index].name}
                            style={{ width: "100%", maxHeight: "120px", objectFit: "scale-down" }} />
                    </Box>
                )}
            </>
        )
    };

    return (
        <>
            {props.productVariations.map((productVariation, index) => (
                <Fragment key={index}>
                    {!productVariation?._id && (
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {productVariation?.name}
                        </Typography>
                    )}
                    <Box display={"flex"} key={index} sx={{ mb: 2 }}>
                        {!productVariation?._id ? (
                            <>
                                <Box>
                                    <Box sx={{ mb: 2, position: "absolute" }}>
                                        <SelectValue
                                            objectKey={"index"}
                                            value={typeof productVariation.images.sourceProductId === 'number' ? productVariation.images.sourceProductId : ""}
                                            setValue={(sourceIndex) => props.handleChangeImageSource(index, sourceIndex)}
                                            menuItems={props.imageSourceMenuItems.filter((obj) => obj.index !== index)}
                                            otherProps={{ minWidth: 175 }} label={"Image source"}
                                            disabled={productVariation.images.main ||
                                                productVariation.images.secondaryImages?.length > 0
                                            }
                                        />
                                    </Box>
                                    <Box display={"flex"} sx={{ mb: 2, mt: 7 }}>
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
                                                <Imgs index={index} imageType="main" />
                                                <Button component="label" variant="contained" size="small" sx={{ fontSize: 12 }} disabled={typeof productVariation.images.sourceProductId === "number"}>
                                                    Upload Main Image
                                                    <VisuallyHiddenInput name="main" type="file" accept="image/jpeg" onChange={(e) => handleChange(e, index)} />
                                                </Button>
                                            </Box>
                                        </Paper>
                                        <IconButton
                                            sx={{ alignSelf: "start" }}
                                            onClick={() => removeImage(index, "main")}
                                            disabled={typeof productVariation.images.sourceProductId === "number"}
                                        >
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Box>
                                    {(props.displayErrors && props.errorHandler) && (
                                        <Box sx={{ mb: 2 }}>
                                            {props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), index - (props.variationsInitialLength ? props.variationsInitialLength : 0), "images", "main").map((errMsg, index) => (
                                                <Alert icon={false} severity="error" key={index} sx={{ mb: 1 }}>
                                                    {errMsg}
                                                </Alert>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                                <Box sx={{ ml: 9, mt: 7 }}>

                                    <Paper elevation={3} sx={{ height: "175px", minWidth: "400px", px: 2 }}>
                                        <Box sx={{ height: "40%", width: "100%", display: "flex", justifyContent: "center", alignItems: "end" }}>
                                            <Button component="label" variant="contained" size="small" disabled={typeof productVariation.images.sourceProductId === "number"}>
                                                Upload Secondary Images
                                                <VisuallyHiddenInput name="secondary" type="file" accept="image/jpeg" multiple onChange={(e) => handleChange(e, index)} />
                                            </Button>
                                        </Box>
                                        <Box sx={{ display: "flex", mt: 3 }}>
                                            <Imgs index={index} imageType="secondaryImages" />
                                        </Box>
                                    </Paper>
                                    {(props.displayErrors && props.errorHandler) && (
                                        <Box sx={{ mt: 2 }}>
                                            {Object.keys(props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), index - (props.variationsInitialLength ? props.variationsInitialLength : 0), "images", "secondaryImages")).map((errKey, errIndex) => (
                                                <Alert icon={false} severity="error" key={errIndex} sx={{ mb: 1 }}>
                                                    Secondary image №{Number(errKey) + 1} - {props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), index - (props.variationsInitialLength ? props.variationsInitialLength : 0), "images", "secondaryImages", errKey).join(", ")}
                                                </Alert>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ mb: 2 }}>
                                <Typography component={Link} to={`/products/${productVariation._id}/edit?menuIndex=2`} variant="body1">
                                    Edit {productVariation.name}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Fragment>
            ))}
        </>
    );
}