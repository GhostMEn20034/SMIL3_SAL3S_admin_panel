import Box from "@mui/material/Box";
import ImageListMultipleProducts from "./ImageListMultipleProducts";
import ImageListOneProduct from "./ImageListOneProduct";


export default function UpdateProductImages(props) {
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
        <Box sx={{ padding: 2, mt: 4 }}>
            {!props.parent || props.sameImages ? (
                <ImageListOneProduct
                    images={props.images}
                    setImages={props.setImages}
                    _id={props._id}
                    imageOps={props.imageOps}
                    setImageOps={props.setImageOps}
                    secondaryImagesLength={props.secondaryImagesLength}
                    setSecondaryImagesLength={props.setSecondaryImagesLength}
                    errorHandler={props.errorHandler}
                    displayErrors={props.displayErrors}
                    baseErrorPath={props.baseErrorPath}
                    findErrors={findErrors}
                />
            ) : (
                <ImageListMultipleProducts
                    productVariations={props.productVariations}
                    setProductVariations={props.setProductVariations}
                    _id={props._id}
                    errorHandler={props.errorHandler}
                    displayErrors={props.displayErrors}
                    baseErrorPath={["new_variations", ]}
                    findErrors={findErrors}
                    variationsInitialLength={props.variationsInitialLength}
                    imageSourceMenuItems={props.imageSourceMenuItems}
                    handleChangeImageSource={props.handleChangeImageSource}
                />
            )}
        </Box>
    )
}