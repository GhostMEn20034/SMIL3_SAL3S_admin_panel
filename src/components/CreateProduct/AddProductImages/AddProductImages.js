import Box from "@mui/material/Box";
import ImageListMultipleProducts from "./ImageListMultipleProducts";
import ImageListOneProduct from "./ImageListOneProduct";
import SelectValueRadioGroup from "../../SelectValueRadioGroup";


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
                    baseErrorPath={["variations",]}
                    findErrors={findErrors}
                    imageSourceMenuItems={props.imageSourceMenuItems}
                    handleChangeImageSource={props.handleChangeImageSource}
                />
            )}
        </Box>
    )
}
