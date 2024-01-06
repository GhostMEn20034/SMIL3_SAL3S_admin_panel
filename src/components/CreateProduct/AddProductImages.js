import { Paper, Box, IconButton, Button, Typography, Alert } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { Link } from "react-router-dom";
import { VisuallyHiddenInput } from "../HiddenInput";
import SelectValueRadioGroup from "../SelectValueRadioGroup";
import { Fragment } from "react";



export function ImageListMultipleProducts(props) {
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
            switch (name) {
                case "main":
                    return prevValues.map((product, i) => {
                        // if product index equals to the index passed into the function, then remove main image
                        if (i === index) {
                            let modifiedImages = { ...product.images };
                            URL.revokeObjectURL(modifiedImages.main?.url);
                            modifiedImages.main = null;
                            return { ...product, images: modifiedImages };
                        }
                        // Else return original product
                        return product;

                    });

                case "secondary":
                    return prevValues.map((product, i) => {
                        // if product index equals to the index passed into the function, 
                        // then remove image in the secondaryImages array
                        if (i === index) {
                            let modifiedImages = { ...product.images };
                            let secondaryImages = modifiedImages.secondaryImages;
                            secondaryImages.splice(secImageIndex, 1);

                            if (secondaryImages.length === 0) {
                                modifiedImages.secondaryImages = null;
                            }

                            return { ...product, images: modifiedImages };
                        }

                        // Else return original product
                        return product;
                    })

                default:
                    // do nothing and return the previous state
                    return prevValues;
            }
        });
    };

    return (
        <>
            {props.productVariations.map((productVariation, index) => (
                <Fragment key={index}>
                    {!productVariation?._id && (
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {productVariation?.name}
                        </Typography>
                    )}
                    <Box display={"flex"} key={index}>
                        {!productVariation?._id ? (
                            <>
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
                                                {productVariation.images.main && (
                                                    <Box>
                                                        <img src={productVariation.images.main.url} alt={productVariation.name}
                                                            style={{ width: "100%", maxHeight: "120px", objectFit: "scale-down" }} />

                                                    </Box>
                                                )}
                                                <Button component="label" variant="contained" size="small" sx={{ fontSize: 12 }}>
                                                    Upload Main Image
                                                    <VisuallyHiddenInput name="main" type="file" accept="image/jpeg" onChange={(e) => handleChange(e, index)} />
                                                </Button>
                                            </Box>
                                        </Paper>
                                        <IconButton sx={{ alignSelf: "start" }} onClick={() => removeImage(index, "main")}>
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Box>
                                    {(props.displayErrors && props.errorHandler) && (
                                        <Box sx={{ mb: 2 }}>
                                            {props.findErrors(...(props.baseErrorPath ? props.baseErrorPath : []), index - (props.variationsInitialLength ? props.variationsInitialLength : 0), "images", "main").map((errMsg, index) => (
                                                <Alert icon={false} severity="error" key={index} sx={{mb: 1}}>
                                                    {errMsg}
                                                </Alert>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                                <Box sx={{ ml: 4 }}>

                                    <Paper elevation={3} sx={{ height: "175px", minWidth: "400px", px: 2 }}>
                                        <Box sx={{ height: "40%", width: "100%", display: "flex", justifyContent: "center", alignItems: "end" }}>
                                            <Button component="label" variant="contained" size="small">
                                                Upload Secondary Images
                                                <VisuallyHiddenInput name="secondary" type="file" accept="image/jpeg" multiple onChange={(e) => handleChange(e, index)} />
                                            </Button>
                                        </Box>
                                        <Box sx={{ display: "flex", mt: 3 }}>
                                            {productVariation.images.secondaryImages && (
                                                productVariation.images.secondaryImages.map((secImage, secImageIndex) => (
                                                    <Paper key={secImageIndex} elevation={2} sx={{ position: "relative", display: "inline-block", mr: 3 }}>
                                                        <Box>
                                                            <img src={secImage.url} key={secImageIndex} alt={"Img " + (secImageIndex + 1)}
                                                                style={{ minWidth: "100px", width: "100%", maxHeight: "60px", objectFit: "scale-down" }} />
                                                        </Box>
                                                        <Box sx={{ ml: 1 }}>
                                                            <IconButton sx={{ top: -17, right: -17, position: "absolute", padding: 0 }} size="small" onClick={() => removeImage(index, "secondary", secImageIndex)}>
                                                                <HighlightOffRoundedIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Paper>
                                                ))
                                            )}
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
                                <Typography component={Link} to={`/products/${productVariation._id}/edit?menuIndex=3`} variant="body1">
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

function ImageListOneProduct(props) {
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

export default function AddProductImages(props) {
    /**
     * Renders form to upload images.
     * If product has no variations, then component 
     * renders form where the user can upload images only for one product.
     * Otherwise, component renders form where the user can upload images for all product variations.
     * List of props:
     * ------------------------------------------------------------------------
     * images - array of files, state of images for product without variations
     * setImages - react setState function for images variable
     * productVariations - array of objects, state of productVariations
     * setProductVariations - react setState function for productVariations
     * hasVariations - boolean, determines whether product has variaitions
     * sameImages - boolean, determines whether the user wants to use the same images for all product variations
     * displayErrors - boolean, determines whether component should display errors.
     * errorHandler - class that returns errors
     * baseErrorPath - Base path to the error, used by the function that finds an error. Suppose your value located in the key images[secondary][1], 
     * in this case you can consider "images" key as base path.
     */

    const findErrors = (...path) => {
        /**
         * Finds errors and return them if they find, otherwise returns an empty array
         */
        if (!props.displayErrors || !props.errorHandler) {
            return [];
        }

        if (!props?.errorHandler?.isValueExist(...path)) {
            return [];
        }

        return props.errorHandler?.getObjectValue(...path);
    };


    return (
        <Box sx={{ padding: 2 }}>
            {props.hasVariations && (
                <Box sx={{ mb: 1 }}>
                    <SelectValueRadioGroup label={"Use the same images for all variations"} value={props.sameImages} setValue={props.setSameImages} menuItems={[
                        { name: "No", value: false },
                        { name: "Yes", value: true }
                    ]} valueType={"boolean"} />
                </Box>
            )
            }
            {!props.hasVariations || props.sameImages ? (
                <ImageListOneProduct
                    images={props.images}
                    setImages={props.setImages}
                    errorHandler={props.errorHandler}
                    displayErrors={props.displayErrors}
                    baseErrorPath={props.baseErrorPath}
                    findErrors={findErrors}
                />
            ) : (
                <ImageListMultipleProducts
                    productVariations={props.productVariations}
                    setProductVariations={props.setProductVariations}
                    errorHandler={props.errorHandler}
                    displayErrors={props.displayErrors}
                    baseErrorPath={["variations", ]}
                    findErrors={findErrors}
                />
            )}
        </Box>
    )
}
