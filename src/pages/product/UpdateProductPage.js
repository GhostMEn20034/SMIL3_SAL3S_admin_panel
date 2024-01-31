import { useEffect, useState, Fragment } from "react";
import useAxios from "../../utils/useAxios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SelectValueRadioGroup from "../../components/SelectValueRadioGroup";
import { updateProductMenuItems, extraAttr } from "../../utils/consts";
import ProductNavigation from "../../components/CreateProduct/ProductMenusNavigation";
import { ModifyNameDialog } from "../../components/CreateProduct/ModifyNameDialog";
import BaseAttrsForm from "../../components/CreateProduct/BaseAttrsForm";
import ProductAttrs from "../../components/CreateProduct/ProductAttrs";
import AdditionalProductAttrs from "../../components/CreateProduct/AdditionalProductAttrs";
import AddProductVariations from "../../components/CreateProduct/ProductVariations/AddProductVariations";
import ProductVariationList from "../../components/CreateProduct/ProductVariations/ProductVariationList";
import UpdateProductImages from "../../components/UpdateProduct/UpdateProductImages/UpdateProductImages";
import SubmitMenu from "../../components/UpdateProduct/SubmitMenu";
import { encodeManyImages, encodeImages, encodeOneImage } from "../../utils/ImageServices";
import ObjectValueExtractor from "../../utils/objectValueExtractor";
import DeleteProductDialog from "../../components/UpdateProduct/DeleteProductDialog";
import KeywordsSection from "../../components/CreateProduct/KeywordsSection";
import HtmlTooltip from "../../components/HtmlTooltip";

export default function UpdateProductPage() {
    const [submitLoading, setSubmitLoading] = useState(false); // loading state for form submission
    const [loading, setLoading] = useState(false); // State of page loading.

    const [currentMenu, setCurrentMenu] = useState(0); // index of current product menu (See updateProductMenuItems in the utils/consts)

    const [product, setProduct] = useState({}); // Product's properties
    const [images, setImages] = useState(null); // Product images
    const [imageOps, setImageOps] = useState({
        add: [],
        delete: [],
        replace: { main: null, secondaryImages: null },
    }); // An Object that stores actions that need to be performed for specified images
    const [secondaryImagesLength, setSecondaryImagesLength] = useState(0); // Initial length of the array with the secondary images

    const [productVariations, setProductVariations] = useState(null); // Product variations
    const [productVariationFields, setProductVariationFields] = useState({}); // Values of product variation fields that included to variation theme
    const [variationsToDelete, setVariationsToDelete] = useState([]); // List of the product variations that the server must delete
    const [variationsLength, setVariationsLength] = useState(0); // Initial length of variations array

    const [searchTerms, setSearchTerms] = useState([]); // List of keywords to improve the accuracy of product searching

    const [attrs, setAttrs] = useState([]); // Product specs
    const [extraAttrs, setExtraAttrs] = useState([]); // attributes to provide additional information about product

    const [variationTheme, setVariationTheme] = useState(null); // Determines differences between product variations 
    const [category, setCategory] = useState({}); // Product category

    const [facets, setFacets] = useState([]); // List of facets, used to form product attributes
    const [facetTypes, setFacetTypes] = useState(null); // List of facet types

    const [openModifyNameDialog, setOpenModifyNameDialog] = useState(false); // Is Modify Name Dialog is opened?
    const [openDeleteProductDialog, setOpenDeleteProductDialog] = useState(false); // Is Delete Product Dialog is opened?

    const [imageSourceMenuItems, setImageSourceMenuItems] = useState([]);

    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));

    const api = useAxios('products'); // Axios instance
    const navigate = useNavigate();
    const { id } = useParams(); // product id parameter

    const [searchParams, setSearchParams] = useSearchParams();
    let menu = searchParams.get("menuIndex");

    const generateVariationFields = (variations, fieldCodes) => {

        // Create an empty object to store the result
        let result = {};

        // Loop through each field code
        for (let fieldCode of fieldCodes) {

            // Create an empty array to store the attributes for this field code
            result[fieldCode] = [];

            // Loop through each variation in the response
            for (let variation of variations) {
                // Find the attribute that matches the field code
                let attribute = variation.attrs.find(attr => attr.code === fieldCode);

                // Check if the attribute is already in the result array
                let isDuplicate = result[fieldCode].some(attr => attr.value === attribute.value);

                // If not, push it to the result array
                if (!isDuplicate) {
                    result[fieldCode].push(attribute);
                }
            }
        }

        return result;
    };

    const onVariationsRemoval = (productObjs) => {
        /**
         * This function calls when user deletes some product variations.
         * Sets product variations that must be deleted by the server.
         * @param productObjs - list of the products that must be deleted by the server.
         */
        // Remove objects that have no "_id" property
        productObjs = productObjs.filter(obj => obj.hasOwnProperty("_id"));

        // Set variations length to prevValue - count of deleted old variations
        setVariationsLength((prevValue) => prevValue - productObjs.length);
        // Reset errors
        setErrorHandler(new ObjectValueExtractor({}, false));
        // Modify variationsToDelete array
        setVariationsToDelete((prevValues) => {
            // Create an array from the previous values and new product Ids
            return [...prevValues, ...productObjs];
        });
    };

    const handleChangeProduct = (keyName, value) => {
        setProduct((prevValue) => (
            {
                ...prevValue,
                [keyName]: value
            }
        ));
    };

    const handleChangeImageSource = (variationIndex, sourceIndex) => {
        /**
         * Handles change of the Product's image source
         * Params:
         * @param variationIndex - Index of the product where function sets source of the images
         * @param sourceIndex - index or objectID of the product which will be source of the images.
        */
        setProductVariations((prevValues) => {
            // Make a copy of product variations and map it
            let newProductVariations = prevValues.map((variation, i) => {
                // if index of the current variation is equal to the variation index passed to the function
                if (i === variationIndex) {
                    return {
                        ...variation, images: {
                            ...variation.images,
                            sourceProductId: sourceIndex
                        }
                    }
                }
                // Otherwise return original variation
                return variation;
            });

            return newProductVariations;

        });
    };


    // Create an array of options for choosing image source
    const makeImageSourceItems = () => {
        return productVariations.map((variation, i) => {
            // If (there is a main image OR there are secondary images) AND there is no image source
            if ((variation.images.main ||
                (variation.images.secondaryImages && variation.images.secondaryImages?.length > 0)) &&
                !variation.images.sourceProductId) {
                // then append product to the result
                return { index: i, name: variation.name };
            }
            // Otherwise, do not append product to the result
            return undefined;
        }).filter(Boolean);
    };

    useEffect(() => {
        setImageSourceMenuItems(
            [
                { index: null, name: "No image source" },
                ...(productVariations ? makeImageSourceItems() : [])
            ]
        );
    }, [productVariations]);


    const getProduct = async () => {
        setLoading(true);
        try {
            // request a product
            let response = await api.get(`/admin/products/${id}`);
            // get data from response.
            let data = await response.data;

            console.log(data);

            let {
                images: prodImages,
                extra_attrs: additionalAttrs,
                attrs: attributes,
                search_terms,
                variations,
                ...item
            } = data.product;

            // set product's base attributes and product's variations
            setProduct(item);
            setProductVariations(variations);
            // if there are product variations, then set length of variations array
            if (variations?.length > 0) {
                setVariationsLength(variations.length);
            }
            // generate variation fields 
            // if there are product variation and there are field codes in variation theme
            if (data.variation_theme?.field_codes.length > 0 && variations?.length > 0) {
                setProductVariationFields(generateVariationFields(variations, data.variation_theme.field_codes));
            }

            setImages(prodImages);
            // if there are secondary images, then set length of secondary images
            if (prodImages.secondaryImages) {
                setSecondaryImagesLength(prodImages.secondaryImages.length);
            }
            setSearchTerms(search_terms);
            // set attributes
            setAttrs(attributes);
            // set extra attributes to the server response if extra attributes length is gt 0.
            // Otherwise set extra attributes to default value (see consts.js/extraAttr).
            setExtraAttrs(additionalAttrs?.length > 0 ? additionalAttrs : [extraAttr,]);

            // set facets and facet types
            setFacets(data.facets);
            setFacetTypes(data.facet_types);

            // set variation theme and category
            setVariationTheme(data.variation_theme);
            setCategory(data.category);

            // set loading state to false
            setLoading(false);

        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            navigate(-1);
        }

        getProduct();
        setCurrentMenu(menu !== null ? Number(menu) : 0);
    }, [id]);

    const goBack = () => {
        navigate(-1);
    };



    const handleSubmit = async () => {

        // Request body
        let body = {
            // product's base atributes
            base_attrs: {
                name: product.name,
                price: product.price,
                discount_rate: product.discount_rate,
                stock: product.stock,
                max_order_qty: product.max_order_qty,
                tax_rate: product.tax_rate,
                sku: product.sku,
                external_id: product.external_id,
            },
            // product's specs
            attrs: attrs,
            // If extra attrs data are filled, then add extra attrs to the request body
            extra_attrs: !(extraAttrs.length === 1 && JSON.stringify(extraAttrs) === JSON.stringify([extraAttr,])) ? extraAttrs : [],
            search_terms: searchTerms,
        };

        // If a product is a parent
        // then add variations to the request body
        if (product.parent) {
            // clone all new variations to avoid mutation of original objects
            let oldVariations = structuredClone(productVariations);
            // Array with the new variations (variations that don't have "_id" property)
            let newVariations = [];
            // Array with the old variations (they have "_id" property)
            oldVariations = oldVariations.filter(variation => {
                // if a variation has "_id" field, it means that it is already existed variation
                // So we add variation to the result
                if (variation.hasOwnProperty("_id")) {
                    // remove images and attrs from the old product variation, 
                    // since backend don't need it when user edits a product parent
                    delete variation.attrs;
                    delete variation.images;
                    return true;
                }
                // If new variation has sourceProductId (Not equal to null)
                if (typeof variation.images.sourceProductId === "number") {
                    // Then get variation at sourceProductIndex
                    let sourceProduct = productVariations[variation.images.sourceProductId];
                    // And if it's old variation
                    if (sourceProduct.hasOwnProperty("_id")) {
                        // Then copy image urls from the this variation, and set sourceProductId to variation's id
                        variation.images = { ...sourceProduct.images, sourceProductId: sourceProduct._id };
                    } else {
                        variation.images = { ...variation.images, sourceProductId: variation.images.sourceProductId - variationsLength }
                    }
                }
                // if a variation has no "_id" property, it means that it's a new variation
                // So we add a variation to newVariations array
                newVariations.push(variation);
                return false;
            });

            newVariations = await Promise.all(newVariations.map(async variation => {
                // If product and its variations have the same images
                if (product.same_images) {
                    // then remove images from the product variation
                    delete variation.images;
                    // Otherwise, check whether variation images have sourceProductId
                } else if (!variation.images.sourceProductId) {
                    // If not, then try to encode images, and save them in variation
                    let encodedImages = await encodeImages(variation.images);
                    variation.images = { ...encodedImages, sourceProductId: variation.images.sourceProductId };
                }
                return variation
            }));

            // Add new and old variations to the request body
            body.new_variations = newVariations;
            body.old_variations = oldVariations;
            body.variations_to_delete = variationsToDelete.map(varToDelete => varToDelete._id);
        } else {
            // Is product for sale
            body.for_sale = product.for_sale;
            // Whether product's specs used in filters
            body.is_filterable = product.is_filterable;
        }

        // create a deep copy of image operations to avoid mutation of original objects
        let encodedImageOps = structuredClone(imageOps);

        // if imageOps.add array has length gt 0, then assign encoded images for add operation.
        encodedImageOps.add = encodedImageOps.add.length > 0 ? await encodeManyImages(encodedImageOps.add) : [];

        // encode new main image
        encodedImageOps.replace.main = await encodeOneImage(encodedImageOps.replace.main);

        // If there are secondary image replacements
        // then encode these replacements
        if (encodedImageOps.replace.secondaryImages?.length > 0) {
            encodedImageOps.replace.secondaryImages = await Promise.all(encodedImageOps.replace.secondaryImages.map(async (img) => {
                img.newImg = await encodeOneImage(img.newImg);
                return img;
            }));
        }

        if (product.same_images || !product.parent) {
            // add encoded image to the request body
            body.image_ops = encodedImageOps;
        }
        try {
            setSubmitLoading(true);
            await api.put(`/admin/products/${id}`, body, { timeout: 25 * 1000 });
            setSubmitLoading(false);
            navigate("/products");
        } catch (err) {
            console.log(err.response.data);
            setSubmitLoading(false);
            // Is errors are basic (errors related with length of fields) ?
            let baseErrors = err.response.data?.base_errors;
            setErrorHandler(() => {

                if (baseErrors) {
                    return new ObjectValueExtractor(err.response.data.errors, true);
                } else {
                    return new ObjectValueExtractor(err.response.data.detail, false);
                }
            });
        }
    };

    const handleSubmitDeletion = async () => {
        try {
            // Request a removal of the product
            await api.delete(`/admin/products/${id}`);
            navigate("/products");
        } catch (e) {
            console.log(e.response.data)
        }
    };

    const getVariationErrors = (isNewVariation, ...path) => {
        /**
         * Return errors by the specified path
         * @param isNewVariation - Do function need to find an error for new variation or for the old one
         * @param path - Path to the variation error 
         */
        let variationType = isNewVariation ? "new_variations" : "old_variations";

        return errorHandler.getObjectValue(variationType, ...path);
    };

    const isVariationErrorExists = (isNewVariation, ...path) => {
        /**
         * Check whether error exists by the specified path
         * @param isNewVariation - Do function need to find an error for new variation or for the old one
         * @param path - Path to the variation error 
         */
        let variationType = isNewVariation ? "new_variations" : "old_variations";

        return errorHandler.isValueExist(variationType, ...path);
    }

    const resetErrors = () => {
        setErrorHandler(new ObjectValueExtractor({}, false));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box padding={2} display={"flex"}>
                <Typography variant="h4">
                    Product information
                </Typography>
                <Box sx={{ ml: 10 }}>
                    <ProductNavigation value={currentMenu} setValue={setCurrentMenu} labels={updateProductMenuItems}
                        disabledButtonIndexes={[
                            product.parent && variationTheme ? null : 1,
                            product.same_images && !product.parent ? 2 : null
                        ]} />
                </Box>
            </Box>
            <Box px={2}>
                <Typography variant="h6">
                    Product category: {category.name}
                </Typography>
            </Box>
            <Box px={2} mt={1} mb={1}>
                <Button variant="contained" color="warning" onClick={goBack}>
                    Go back
                </Button>
            </Box>
            <Box px={2} mt={1} mb={1}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={
                        () => setOpenDeleteProductDialog(true)
                    }
                >
                    Delete Product
                </Button>
            </Box>
            {JSON.stringify(errorHandler.obj) !== JSON.stringify({}) && (
                <Box px={2} mb={1}>
                    <Button variant="contained" color="error" onClick={resetErrors}>
                        Reset Errors
                    </Button>
                </Box>
            )}
            {openDeleteProductDialog && (
                <DeleteProductDialog
                    open={openDeleteProductDialog}
                    setOpen={setOpenDeleteProductDialog}
                    parent={product.parent}
                    name={product.name}
                    handleSubmit={handleSubmitDeletion}
                />
            )}
            <Box display="flex" justifyContent="center" alignItems="center">
                {currentMenu === 0 && (
                    <Box>
                        {openModifyNameDialog && (
                            <ModifyNameDialog
                                open={openModifyNameDialog} // boolean value that determines is modal window opened
                                setOpen={setOpenModifyNameDialog} // react setState function to set is modal window opened
                                attrs={attrs} // array of the attributes
                                nameValue={product.name ? product.name : ""} // value of the name property of newProdValues obj
                                changeName={(newValue) => {

                                    if (newValue === "" || newValue === 0) {
                                        newValue = null;
                                    }

                                    setProduct((prevValue) => (
                                        {
                                            ...prevValue,
                                            name: newValue
                                        }
                                    ));
                                }} // function to change a name property of the newProdValues obj
                                resetProductName={() => setProduct((prevValue) => ({ ...prevValue, name: null }))} // function to reset product name
                            />
                        )}
                        {variationTheme && (
                            <Box sx={{ mb: 2, ml: "13.5%", width: "325px" }}>
                                <Typography variant="body1" display={"flex"}>
                                    Variation theme:&nbsp;<span style={{ color: "#098ed6" }}>{variationTheme.name}</span>
                                </Typography>
                            </Box>
                        )}
                        <Box sx={{ ml: "13.5%", mb: 2 }}>
                            <BaseAttrsForm
                                baseAttrs={product}
                                setBaseAttrs={setProduct}
                                openDialog={openModifyNameDialog}
                                setOpenDialog={setOpenModifyNameDialog}
                                errorHandler={errorHandler}
                                errorBasePath={["base_attrs",]}
                            />
                            <Typography variant="body1" display={"flex"} sx={{ mt: 2 }}>
                                Is product is the parent:&nbsp;<span style={{ color: "#098ed6" }}>{product.parent ? "Yes" : "No"}</span>
                            </Typography>
                            {(product.parent) && (
                                <Typography variant="body1" display={"flex"} sx={{ mt: 1 }}>
                                    Variations have the same images:&nbsp;<span style={{ color: "#098ed6" }}>{product.same_images ? "Yes" : "No"}</span>
                                </Typography>
                            )}
                            {!product.parent && (
                                <>
                                    <Box sx={{ mt: 1 }}>
                                        <SelectValueRadioGroup label={"Is product for sale?"} value={product.for_sale} setValue={(value) => handleChangeProduct("for_sale", value)} menuItems={[
                                            { name: "No", value: false },
                                            { name: "Yes", value: true }
                                        ]} valueType={"boolean"} />
                                    </Box>
                                    <Box sx={{ mt: 1 }}>
                                        <SelectValueRadioGroup label={"Is the product is filterable?"} value={product.is_filterable} setValue={(value) => handleChangeProduct("is_filterable", value)} menuItems={[
                                            { name: "No", value: false },
                                            { name: "Yes", value: true }
                                        ]} valueType={"boolean"} />
                                    </Box>
                                </>
                            )}
                        </Box>

                        <Box>
                            <Box sx={{ maxWidth: "1000px", ml: "13.5%" }}>
                                <ProductAttrs
                                    attrs={attrs} facets={facets}
                                    setAttrs={setAttrs} groups={category.groups}
                                    errorHandler={errorHandler} displayErrors={true}
                                    baseErrorPath={["attrs",]}
                                />
                            </Box>

                            <Box sx={{ mb: 2 }} display="flex" alignItems="center">
                                <Typography variant="h6" sx={{ mr: 0.5 }}>
                                    Additional attributes
                                </Typography>
                                <HtmlTooltip title={
                                    <Fragment>
                                        <Typography color="inherit"><b>Additional attributes</b></Typography>
                                        <Typography variant="body2">
                                            Attributes to provide additional information about the product
                                        </Typography>
                                    </Fragment>
                                }>
                                    <HelpOutlineIcon />
                                </HtmlTooltip>
                            </Box>

                            <Box sx={{ maxWidth: "1000px" }}>
                                <AdditionalProductAttrs
                                    additionalAttrs={extraAttrs}
                                    setAdditionalAttrs={setExtraAttrs}
                                    facetTypes={facetTypes}
                                    errorHandler={errorHandler}
                                    displayErrors={true}
                                    baseErrorPath={["extra_attrs",]}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}

                {currentMenu === 1 && productVariations && product.parent && (
                    <Box sx={{ width: 1000 }}>
                        <Box>
                            <AddProductVariations
                                facets={variationTheme?.field_codes.map((fieldCode) => facets.find(facet => facet.code === fieldCode))}
                                productVariationFields={productVariationFields}
                                setProductVariationFields={setProductVariationFields}
                                productVariations={productVariations}
                                setProductVariations={setProductVariations}
                                groups={category.groups}
                                callbackOnDelete={onVariationsRemoval}
                                keysForCallback={["_id", "name"]}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <ProductVariationList
                                productVariations={productVariations}
                                setProductVariations={setProductVariations}
                                productVariationFields={productVariationFields}
                                setProductVariationFields={setProductVariationFields}
                                variationFields={variationTheme?.field_codes}
                                editMode={true}
                                attrs={attrs}
                                callbackOnDelete={onVariationsRemoval}
                                keysForCallback={["_id", "name"]}
                                errorHandler={errorHandler}
                                getVariationErrors={getVariationErrors}
                                isVariationErrorExists={isVariationErrorExists}
                                variationsInitialLength={variationsLength}
                            />
                        </Box>
                    </Box>
                )}
                {currentMenu === 2 && (
                    <Box maxWidth={1200}>
                        <UpdateProductImages
                            productVariations={productVariations}
                            setProductVariations={setProductVariations}
                            imageOps={imageOps}
                            setImageOps={setImageOps}
                            images={images}
                            setImages={setImages}
                            parent={product.parent}
                            sameImages={product.same_images}
                            _id={product._id}
                            secondaryImagesLength={secondaryImagesLength}
                            setSecondaryImagesLength={setSecondaryImagesLength}
                            errorHandler={errorHandler}
                            displayErrors={true}
                            baseErrorPath={!product.parent || product.same_images ? ["image_ops",] : ["images"]}
                            variationsInitialLength={variationsLength}
                            imageSourceMenuItems={imageSourceMenuItems}
                            handleChangeImageSource={handleChangeImageSource}
                        />
                    </Box>
                )}
                {currentMenu === 3 && (
                    <Box sx={{ width: 1200, mt: 3 }}>
                        <KeywordsSection searchTerms={searchTerms} setSearchTerms={setSearchTerms} />
                    </Box>
                )}
                {currentMenu === 4 && (
                    <Box sx={{ width: 1200 }}>
                        <SubmitMenu
                            parent={product.parent}
                            productVariationCount={productVariations?.length || 1}
                            variationsToDelete={variationsToDelete}
                            handleSubmit={handleSubmit}
                            loading={submitLoading}
                            errorHandler={errorHandler}
                        />
                    </Box>
                )}
            </Box>
        </>
    );
}