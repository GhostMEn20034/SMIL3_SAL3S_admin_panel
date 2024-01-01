import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

import SelectValueRadioGroup from "../components/SelectValueRadioGroup";
import { extraAttr } from "../utils/consts";
import { productMenuNavigationItems } from "../utils/consts";
import ProductNavigation from "../components/CreateProduct/ProductMenusNavigation";
import { ModifyNameDialog } from "../components/CreateProduct/ModifyNameDialog";
import BaseAttrsForm from "../components/CreateProduct/BaseAttrsForm";
import ProductAttrs from "../components/CreateProduct/ProductAttrs";
import AdditionalProductAttrs from "../components/CreateProduct/AdditionalProductAttrs";
import AddProductVariations from "../components/CreateProduct/ProductVariations/AddProductVariations";
import ProductVariationList from "../components/CreateProduct/ProductVariations/ProductVariationList";
import UpdateProductImages from "../components/UpdateProduct/UpdateProductImages";
import SubmitMenu from "../components/UpdateProduct/SubmitMenu";
import { encodeManyImages, encodeImages, encodeOneImage } from "../utils/ImageServices";

export default function UpdateProductPage() {
    const [submitLoading, setSubmitLoading] = useState(false); // loading state for form submission
    const [loading, setLoading] = useState(false); // State of page loading.

    const [currentMenu, setCurrentMenu] = useState(0); // index of current product menu (See productMenuNavigationItems in the utils/consts)

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

    const [attrs, setAttrs] = useState([]); // Product specs
    const [extraAttrs, setExtraAttrs] = useState([]); // attributes to provide additional information about product

    const [variationTheme, setVariationTheme] = useState(null); // Determines differences between product variations 
    const [category, setCategory] = useState({}); // Product category

    const [facets, setFacets] = useState([]); // List of facets, used to form product attributes
    const [facetTypes, setFacetTypes] = useState(null); // List of facet types

    const [openDialog, setOpenDialog] = useState(null); // Name of the opened dialog

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

    const getProduct = async () => {
        setLoading(true);
        try {
            // request a product
            let response = await api.get(`/admin/products/${id}`);
            // get data from response.
            let data = await response.data;

            let {
                images: prodImages,
                extra_attrs: additionalAttrs,
                attrs: attributes,
                variations,
                ...item
            } = data.product;

            // set product's base attributes and product's variations
            setProduct(item);
            setProductVariations(variations);

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
            console.log(data);

        } catch (err) {
            console.log(err);
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
                tax_rate: product.tax_rate,
                sku: product.sku,
                external_id: product.external_id,
            },
            // Is product for sale
            for_sale: product.for_sale,
            // Whether product's specs used in filters
            is_filterable: product.is_filterable,
            // product's specs
            attrs: attrs,
            // If extra attrs data are filled, then add extra attrs to the request body
            // additional product's specs
            extra_attrs: !(extraAttrs.length === 1 && JSON.stringify(extraAttrs) === JSON.stringify([extraAttr,])) ? extraAttrs : [],
            // List of the variations that server must delete
            variations_to_delete: variationsToDelete.map(varToDelete => varToDelete._id),
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
                    // remove images from the old product variation, 
                    // since backend don't need it when user edits a product parent
                    delete variation.images;
                    return true;
                }

                // If product and its variations have the same images
                if (product.same_images) {
                    // then remove images from the product variation
                    delete variation.images;
                } else {
                    encodeImages(variation.images).then((encodedImages) => {
                        variation.images = encodedImages;
                    });
                }
                // if a variation has no "_id" property, it means that it's a new variation
                // So we add a variation to newVariations array
                newVariations.push(variation);
                return false;
            });
            // Add new and old variations to the request body
            body.new_variations = newVariations;
            body.old_variations = oldVariations;
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
                img.to = await encodeOneImage(img.to);
                return img;
            }));
        }
        


        // add encoded image to the request body
        body.image_ops = encodedImageOps;

        console.log(body);
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
                <Box sx={{ ml: 20 }}>
                    <ProductNavigation value={currentMenu} setValue={setCurrentMenu} labels={productMenuNavigationItems} disabledButtonIndexes={[product.parent && variationTheme ? null : 1]} />
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
            <Box display="flex" justifyContent="center" alignItems="center">
                {currentMenu === 0 && (
                    <Box>
                        {openDialog && (
                            <ModifyNameDialog
                                open={openDialog} // boolean value that determines is modal window opened
                                setOpen={setOpenDialog} // react setState function to set is modal window opened
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
                                openDialog={openDialog}
                                setOpenDialog={setOpenDialog}
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
                                    attrs={attrs}
                                    facets={facets}
                                    setAttrs={setAttrs}
                                    groups={category.groups}
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6">
                                    Additional attributes
                                </Typography>
                            </Box>

                            <Box sx={{ maxWidth: "1000px" }}>
                                <AdditionalProductAttrs
                                    additionalAttrs={extraAttrs}
                                    setAdditionalAttrs={setExtraAttrs}
                                    facetTypes={facetTypes}
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
                        />
                    </Box>
                )}
                {currentMenu === 3 && (
                    <Box sx={{ width: 1200 }}>
                        <SubmitMenu
                            parent={product.parent}
                            productVariationCount={productVariations?.length || 1}
                            variationsToDelete={variationsToDelete}
                            handleSubmit={handleSubmit}
                            loading={submitLoading}
                        // errorHandler={errorHandler}
                        />
                    </Box>
                )}
            </Box>
        </>
    );
}