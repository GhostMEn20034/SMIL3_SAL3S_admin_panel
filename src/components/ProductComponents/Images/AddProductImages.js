import { Paper, Box, IconButton, Button } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { VisuallyHiddenInput } from "../../HiddenInput";
import SelectValueRadioGroup from "../../SelectValueRadioGroup";



function ImageListMultipleProducts(props) {

    const handleChange = (e, index) => {
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
                            // If user specified that he wants same images for all variations,
                            // then apply the same photo to all variations.
                            if (props.sameImages) {
                                let modifiedImages = { ...product.images };
                                modifiedImages.main = img;
                                return { ...product, images: modifiedImages };
                            }

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
                            // If user specified that he wants same images for all variations,
                            // then apply the same photo to all variations.
                            if (props.sameImages) {
                                let modifiedImages = { ...product.images };
                                let secondaryImages = modifiedImages.secondaryImages;
                                // Unzip previous secondary images if it is not null and add new images
                                modifiedImages.secondaryImages = [...(secondaryImages ? secondaryImages : []), ...temp];
                                return { ...product, images: modifiedImages };
                            }

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
        props.setProductVariations((prevValues) => {
            switch (name) {
                case "main":
                    return prevValues.map((product, i) => {

                        // if product index equals to the index passed into the function, then remove main image
                        if (i === index) {
                            let modifiedImages = { ...product.images };
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
            {props.productVariations.map((productVariaton, index) => (
                <Box display={"flex"} key={index}>
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
                                {productVariaton.images.main && (
                                    <Box>
                                        <img src={productVariaton.images.main.url} alt={productVariaton.name}
                                            style={{ width: "100%", maxHeight: "120px", objectFit: "scale-down" }} />

                                    </Box>
                                )}
                                <Button component="label" variant="contained" size="small" sx={{ fontSize: 12 }}>
                                    Upload Main Image
                                    <VisuallyHiddenInput name="main" type="file" accept="image/*" onChange={(e) => handleChange(e, index)} />
                                </Button>
                            </Box>
                        </Paper>
                        <IconButton sx={{ alignSelf: "start" }} onClick={() => removeImage(index, "main")}>
                            <DeleteForeverIcon />
                        </IconButton>
                    </Box>
                    <Box>
                        <Paper elevation={3} sx={{ height: "175px", minWidth: "400px", px: 2 }}>
                            <Box sx={{ height: "40%", width: "100%", display: "flex", justifyContent: "center", alignItems: "end" }}>
                                <Button component="label" variant="contained" size="small">
                                    Upload Secondary Images
                                    <VisuallyHiddenInput name="secondary" type="file" accept="image/*" multiple onChange={(e) => handleChange(e, index)} />
                                </Button>
                            </Box>
                            <Box sx={{ display: "flex", mt: 3 }}>
                                {productVariaton.images.secondaryImages && (
                                    productVariaton.images.secondaryImages.map((secImage, secImageIndex) => (
                                        <Paper key={secImageIndex} elevation={2} sx={{ position: "relative", display: "inline-block", mr: 3 }}>
                                            <Box>
                                                <img src={secImage.url} key={secImageIndex} alt={productVariaton.name}
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
                    </Box>
                </Box>
            ))}
        </>
    );
}

function ImageListOneProduct(props) {

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
        });
    };

    const removeImage = (name, secImageIndex) => {
        props.setImages((prevValues) => {
            switch (name) {
                case "main":
                    return { ...prevValues, main: null };

                case "secondary":
                    let modifiedImages = { ...prevValues };
                    let secondaryImages = modifiedImages.secondaryImages;
                    secondaryImages.splice(secImageIndex, 1);

                    if (secondaryImages.length === 0) {
                        secondaryImages = null;
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
            <Box display={"flex"}>
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
                                <VisuallyHiddenInput name="main" type="file" accept="image/*" />
                            </Button>
                        </Box>
                    </Paper>
                    <IconButton sx={{ alignSelf: "start" }} onClick={() => removeImage("main")}>
                        <DeleteForeverIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box>
                <Paper elevation={3} sx={{ height: "175px", minWidth: "400px", px: 2 }}>
                    <Box sx={{ height: "40%", width: "100%", display: "flex", justifyContent: "center", alignItems: "end" }}>
                        <Button component="label" variant="contained" size="small">
                            Upload Secondary Images
                            <VisuallyHiddenInput name="secondary" type="file" accept="image/*" multiple onChange={(e) => handleChange(e)} />
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
            </Box>
        </Box>
    )
}

export default function AddProductImages(props) {


    return (
        <Box sx={{ padding: 2, width: 1200 }}>
            {!props.hasVariations ? (
                <ImageListOneProduct
                    images={props.images}
                    setImages={props.setImages}
                />
            ) : (
                <>
                    <SelectValueRadioGroup label={"Use the same images for all variations"} value={props.sameImages} setValue={props.setSameImages} menuItems={[
                        { name: "No", value: false },
                        { name: "Yes", value: true }
                    ]} valueType={"boolean"} />
                    <ImageListMultipleProducts
                        productVariations={props.productVariations}
                        setProductVariations={props.setProductVariations}
                        sameImages={props.sameImages}
                    />
                </>
            )}
        </Box>
    )
}
