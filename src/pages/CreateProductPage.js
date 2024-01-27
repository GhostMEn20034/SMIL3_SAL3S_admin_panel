import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { Box, Typography, CircularProgress, Button, Alert } from "@mui/material";
import { facetsToAttrs, getArrayElems } from "../utils/Services";
import SelectValueRadioGroup from "../components/SelectValueRadioGroup";
import ProductAttrs from "../components/CreateProduct/ProductAttrs";
import AdditionalProductAttrs from "../components/CreateProduct/AdditionalProductAttrs";
import { extraAttr, productImages, productMenuNavigationItems } from "../utils/consts";
import ProductNavigation from "../components/CreateProduct/ProductMenusNavigation";
import AddProductVariations from "../components/CreateProduct/ProductVariations/AddProductVariations";
import ProductVariationList from "../components/CreateProduct/ProductVariations/ProductVariationList";
import { baseAttrs } from "../utils/consts";
import BaseAttrsForm from "../components/CreateProduct/BaseAttrsForm";
import { ModifyNameDialog } from "../components/CreateProduct/ModifyNameDialog";
import ChooseVarThemeForm from "../components/CreateProduct/ChooseVarThemeForm";
import AddProductImages from "../components/CreateProduct/AddProductImages/AddProductImages";
import SubmitMenu from "../components/CreateProduct/SubmitMenu";
import { encodeImages } from "../utils/ImageServices";
import ObjectValueExtractor from "../utils/objectValueExtractor";

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false); // State of page loading.

  const [submitLoading, setSubmitLoading] = useState(false); // loading state for form submission

  const [currentMenu, setCurrentMenu] = useState(0); // index of current product menu (See productMenuNavigationItems in the utils/consts)

  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState(null); // Data required to create a product

  const [hasVariations, setHasVariations] = useState(false); // Determines whether product has variations
  const [isFilterable, setIsFilterable] = useState(false); // Determines whether product's attributes can be used in filters
  const [variationTheme, setVariationTheme] = useState(null); // variation theme
  const [variationThemeFields, setVariationThemeFields] = useState([]); // Chosen variation theme fields

  const [productVariationFields, setProductVariationFields] = useState({}); // Values of fields for product variations
  const [productVariations, setProductVariations] = useState([]); // Array of product variations

  const [baseAttributes, setBaseAttributes] = useState({ ...baseAttrs }); // Base attributes such as product name, price, sku etc

  const [images, setImages] = useState(productImages); // Product images
  const [sameImages, setSameImages] = useState(false); // Determines whether user wants to upload the same photos to all variations 

  const [attrs, setAttrs] = useState([]); // Product specs, for example: screen size, CPU, storage size etc

  const [extraAttrs, setExtraAttrs] = useState([extraAttr]) // attributes to provide additional information about product 

  const [openDialog, setOpenDialog] = useState(false); // Determines whether dialog window to modify product name opened

  const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));

  const [imageSourceMenuItems, setImageSourceMenuItems] = useState([]);

  const api = useAxios('products');
  const navigate = useNavigate();

  const getFormData = async () => {
    setLoading(true);
    let params = {
      category_id: searchParams.get("categoryID"),
    };

    try {
      let response = await api.get("/admin/products/create", {
        params: params,
      });
      let data = await response.data;
      setFormData(data);
      setAttrs(facetsToAttrs(data.facets));
      setLoading(false);
    } catch (err) {
      console.log("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchParams.get("categoryID")) {
      navigate(-1);
    }
    getFormData();
  }, []);

  const handleChangeHasVariation = (value) => {
    setHasVariations((prevValue) => {
      if (prevValue) { // if prevValue is true
        setVariationTheme(null);
        setVariationThemeFields([]);
        setProductVariations([]);
        setProductVariationFields({});
        setSameImages(false);
        return value;
      }


      return value;
    })
  };

  const handleChangeVariationTheme = (newVariationTheme) => {
    // newVariationTheme - new variation theme value

    setProductVariations([]);
    setProductVariationFields({});

    if (!newVariationTheme) {

      setVariationTheme(null);
      setVariationThemeFields([]);
      setCurrentMenu(0);
      return;
    }

    let fieldCodes = getArrayElems(newVariationTheme.options, "field_codes");

    if (fieldCodes.length > 0) {
      setVariationThemeFields(fieldCodes);
      setVariationTheme(newVariationTheme);
      setCurrentMenu(0);
      return;
    }

    setVariationThemeFields([]);
    setVariationTheme(null);
    setCurrentMenu(0);
  };

  const handleChangeImageSource = (variationIndex, sourceIndex) => {
    /**
     * Handles change of the Product's image source
     * Params:
     * @param variationIndex - Index of the product where function sets source of the images
     * @param sourceIndex - index of the product which will be source of the images.
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
        ...makeImageSourceItems()
      ]
    );
  }, [productVariations]);

  const handleSubmit = async () => {
    // Request body
    let body = {
      base_attrs: baseAttributes,
      attrs: attrs,
      is_filterable: isFilterable,
      has_variations: hasVariations,
      same_images: sameImages,
      variation_theme: variationTheme,
      category: formData.category._id
    };

    delete body.base_attrs.images;

    // If extra attrs data are filled, then add extra attrs to the request body
    if (!(extraAttrs.length === 1 && JSON.stringify(extraAttrs) === JSON.stringify([extraAttr,]))) {
      body.extra_attrs = extraAttrs;
    }

    // if product has variations and variation theme is chosen
    if (hasVariations && variationTheme) {

      // Make a deep clone of products array
      let clonedProducts = structuredClone(productVariations);

      // if sameImages is true (if user wants to use the same images for all variations)
      if (sameImages) {
        // remove old images from all product variations
        let products = clonedProducts.map((product) => {
          delete product.images;
          return product;
        });

        // convert all images from File object to the base64 string
        let encodedImages = await encodeImages(images);

        // Add product variations and images to the request body
        body.variations = products;
        body.images = encodedImages;
      } else { // if sameImages is false (if user don't want to use the same images for all variations)

        // Convert each image from File object to base64 string
        let products = await Promise.all(clonedProducts.map(async (product) => {
          if (typeof product.images.sourceProductId !== 'number') {
            // use the await keyword to wait for the encodeImages function to resolve
            let encodedImages = await encodeImages(product.images);
            // replace File objects on base64 encoded images 
            product.images = {...encodedImages, sourceProductId: null};
            // Set image source to null
          }

          return product;
        }));

        // Add product variations to the request body
        body.variations = products;
      }

      // if product has no variations and variation theme is not chosen
    } else {
      // Add only images to the request body
      let encodedImages = await encodeImages(images);
      body.images = encodedImages;
    }

    try {
      setSubmitLoading(true);
      // send a request to create products
      await api.post('/admin/products/create', body, { timeout: 25 * 1000 });
      setSubmitLoading(false);
      navigate("/products");
    } catch (err) {
      setSubmitLoading(false);
      // Is errors are basic (errors related with length of fields) ?
      let baseErrors = err.response.data?.base_errors;
      setErrorHandler((prevObj) => {
        if (baseErrors) {
          // assign errors that came from the server 
          prevObj.obj = err.response.data.errors;
          // set serializedKeys to true since base errors have serialized keys
          prevObj.serializedKeys = true;
          return prevObj;
        } else {
          // assign errors that came from the server
          prevObj.obj = err.response.data.detail;
          // set serializedKeys to false since regular errors doesn't have serialized keys
          prevObj.serializedKeys = false;
          return prevObj;
        }
      });
    }

  };

  const goBack = () => {
    navigate(-1);
  };

  const resetErrors = () => {
    setErrorHandler(new ObjectValueExtractor({}, false));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Box padding={2} display="flex">
        <Typography variant="h4">
          Create product
        </Typography>
        <Box sx={{ ml: 20 }}>
          <ProductNavigation value={currentMenu} setValue={setCurrentMenu} labels={productMenuNavigationItems} disabledButtonIndexes={[hasVariations ? null : 1, hasVariations && variationTheme ? null : 2]} />
        </Box>
      </Box>
      {/* Choosen category */}
      <Box px={2}>
        <Typography variant="h6">
          Chosen category: {formData?.category.name}
        </Typography>
      </Box>
      <Box px={2} mt={1} mb={1}>
        <Button variant="contained" color="warning" onClick={goBack}>
          Go back
        </Button>
      </Box>
      {JSON.stringify(errorHandler.obj) !== JSON.stringify({}) && (
        <Box px={2} mb={1}>
          <Button variant="contained" color="error" onClick={resetErrors}>
            Reset Errors
          </Button>
        </Box>
      )}

      <Box display="flex" justifyContent="center" alignItems="center">
        {/* Radio button to select whether product has variations and form to select variation theme */}

        {currentMenu === 0 && (

          <Box>
            {openDialog && (
              <ModifyNameDialog
                open={openDialog} // boolean value that determines is modal window opened
                setOpen={setOpenDialog} // react setState function to set is modal window opened
                attrs={attrs.filter((attr) => !Object.keys(productVariationFields).includes(attr.code))} // array of the attributes
                nameValue={baseAttributes.name ? baseAttributes.name : ""} // value of the name property of newProdValues obj
                changeName={(newValue) => {

                  if (newValue === "" || newValue === 0) {
                    newValue = null;
                  }

                  setBaseAttributes((prevValue) => (
                    {
                      ...prevValue,
                      name: newValue
                    }
                  ));
                }} // function to change a name property of the newProdValues obj
                resetProductName={() => setBaseAttributes((prevValue) => ({ ...prevValue, name: null }))} // function to reset product name
              />
            )}
            <Box sx={{ mb: 1, ml: "13.5%" }}>
              <SelectValueRadioGroup label={"Does the product has variations?"} value={hasVariations} setValue={handleChangeHasVariation} menuItems={[
                { name: "No", value: false },
                { name: "Yes", value: true }
              ]} valueType={"boolean"} />
            </Box>
            {hasVariations && (
              <Box sx={{ mb: 2, ml: "13.5%", width: variationTheme ? "325px" : "450px" }}>
                <Alert severity={variationTheme ? "info" : "warning"}>
                  {variationTheme ? `Chosen variation: ${variationTheme.name}` : 'Please, choose variation theme at "Variation Theme" section'}
                </Alert>
              </Box>
            )}
            <Box sx={{ ml: "13.5%", mb: 1 }}>
              <BaseAttrsForm
                baseAttrs={baseAttributes}
                setBaseAttrs={setBaseAttributes}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                errorHandler={errorHandler}
                errorBasePath={["base_attrs",]}
              />
              <Box sx={{ mt: 1 }}>
                <SelectValueRadioGroup
                  label={"Is the product is filterable?"}
                  value={isFilterable}
                  setValue={setIsFilterable}
                  menuItems={[
                    { name: "No", value: false },
                    { name: "Yes", value: true }
                  ]}
                  valueType={"boolean"}
                />
              </Box>
            </Box>


            {/* Dynamic forms for product attributes and additional product attributes */}
            {formData && (
              <Box>

                {/* Dynamic forms for product attributes */}
                <Box sx={{ maxWidth: "1000px", ml: "13.5%" }}>
                  <ProductAttrs attrs={attrs} facets={formData.facets} setAttrs={setAttrs}
                    groups={formData?.category.groups}
                    errorHandler={errorHandler} displayErrors={true}
                    baseErrorPath={["attrs",]}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Additional attributes
                  </Typography>
                </Box>

                {/* Dynamic forms for additional product attributes */}
                <Box sx={{ maxWidth: "1000px" }}>
                  <AdditionalProductAttrs
                    additionalAttrs={extraAttrs}
                    setAdditionalAttrs={setExtraAttrs}
                    facetTypes={formData.facet_types}
                    errorHandler={errorHandler}
                    displayErrors={true}
                    baseErrorPath={["extra_attrs",]}

                  />
                </Box>

              </Box>
            )}

          </Box>

        )}

        {currentMenu === 1 && hasVariations && (
          <ChooseVarThemeForm
            variationTheme={variationTheme}
            variationThemes={formData.variation_themes}
            facets={formData.facets}
            handleSubmit={handleChangeVariationTheme}
            errorHandler={errorHandler}
          />
        )}

        {currentMenu === 2 && hasVariations && (

          <Box sx={{ width: 1150 }}>
            <Box>
              <AddProductVariations facets={variationThemeFields.map((varThemeField) => formData.facets.find(facet => facet.code === varThemeField))}
                productVariationFields={productVariationFields}
                setProductVariationFields={setProductVariationFields}
                productVariations={productVariations}
                setProductVariations={setProductVariations}
                groups={formData?.category.groups}
              />
            </Box>
            <Box sx={{ mt: 2, }}>
              <ProductVariationList
                productVariations={productVariations}
                setProductVariations={setProductVariations}
                productVariationFields={productVariationFields}
                setProductVariationFields={setProductVariationFields}
                attrs={attrs}
                variationFields={variationThemeFields}
                errorHandler={errorHandler}
              />
            </Box>
          </Box>

        )}

        {currentMenu === 3 && (
          <Box sx={{ width: 1200 }}>
            <AddProductImages productVariations={productVariations}
              setProductVariations={setProductVariations}
              hasVariations={hasVariations}
              images={images}
              setImages={setImages}
              sameImages={sameImages}
              setSameImages={setSameImages}
              errorHandler={errorHandler}
              displayErrors={true}
              baseErrorPath={["images",]}
              imageSourceMenuItems={imageSourceMenuItems}
              handleChangeImageSource={handleChangeImageSource}
            />
          </Box>
        )}
        {currentMenu === 4 && (
          <Box sx={{ width: 1200 }}>
            <SubmitMenu
              hasVariations={hasVariations}
              productVariationCount={productVariations.length}
              handleSubmit={handleSubmit}
              loading={submitLoading}
              errorHandler={errorHandler}
            />
          </Box>
        )}
      </Box>
    </>
  )
}