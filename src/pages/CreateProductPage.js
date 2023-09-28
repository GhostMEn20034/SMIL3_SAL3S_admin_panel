import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { facetsToAttrs, getArrayElems } from "../utils/Services";
import SelectValueRadioGroup from "../components/SelectValueRadioGroup";
import SelectValue from "../components/SelectValue";
import ProductAttrs from "../components/CreateProductComponents/ProductAttrs";
import AdditionalProductAttrs from "../components/CreateProductComponents/AdditionalProductAttrs";
import { extraAttr, productMenuNavigationItems } from "../utils/consts";
import ProductNavigation from "../components/CreateProductComponents/ProductMenusNavigation";

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(0); // index of current product menu (Show productMenuNavigationItems in the utils/consts)
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(null); // Data required to create a product
  const [hasVariations, setHasVariations] = useState(false); // Determine whether product has variations
  const [variationTheme, setVariationTheme] = useState(null); // Chosen variation theme ID
  const [variationThemeFields, setVariationThemeFields] = useState([]); // Chosen variation theme fields
  const [baseAttrs, setBaseAttrs] = useState([]); // Base attributes such as product name, price, sku etc
  const [attrs, setAttrs] = useState([]); // Product specs, for example: screen size, CPU, storage size etc
  const [extraAttrs, setExtraAttrs] = useState([extraAttr]) // attributes to provide additional information about product 

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
    console.log(value);
    setHasVariations((prevValue) => {
      if (prevValue) { // if prevValue is true
        setVariationTheme(null);
        setVariationThemeFields([]);
        return value
      }

      return value;
    })
  };

  const handleChangeVariationTheme = (newVariationTheme) => {
    // newVariationTheme - new variation theme value

    if (!newVariationTheme) {
      setVariationTheme(null);
      setVariationThemeFields([]);
      return;
    }

    let variationThemeData = formData.variation_themes.find(varTheme => varTheme._id === newVariationTheme);

    setVariationTheme(newVariationTheme);
    setVariationThemeFields(getArrayElems(variationThemeData.filters, "field_codes"));

  };

  const goBack = () => {
    navigate(-1);
  };

  // console.log(attrs);
  // console.log(currentMenu);
  // console.log(extraAttrs);

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
          <ProductNavigation value={currentMenu} setValue={setCurrentMenu} values={productMenuNavigationItems} />
        </Box>
      </Box>
      {/* Choosen category */}
      <Box px={2}>
        <Typography variant="h6">
          Chosen category: {formData?.category.name}
        </Typography>
      </Box>
      <Box px={2} mt={1}>
        <Button variant="contained" color="warning" onClick={goBack}>
          Go back
        </Button>
      </Box>
      <Box px={2} mt={1}>

      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        {/* Radio button to select whether product has variations and form to select variation theme */}

        {currentMenu === 0 && (

          <Box>

            <Box sx={{ mb: 1, ml: "25%" }}>
              <SelectValueRadioGroup label={"Does product has variations?"} value={hasVariations} setValue={handleChangeHasVariation} menuItems={[
                { name: "No", value: false },
                { name: "Yes", value: true }
              ]} valueType={"boolean"} />
            </Box>
            {hasVariations && (
              <Box sx={{ mb: 2, ml: "25%" }}>
                <Typography variant="body1">
                  Variation theme
                </Typography>
                <SelectValue value={variationTheme ? variationTheme : ""} setValue={(newValue) => handleChangeVariationTheme(newValue)} menuItems={formData.variation_themes} objectKey={"_id"} />
              </Box>
            )}

            {/* Dynamic forms for product attributes and additional product attributes */}
            {formData && (
              <Box>

                {/* Dynamic forms for product attributes */}
                <Box sx={{ maxWidth: "1000px" }} display="flex" justifyContent="center" alignItems="center">
                  <ProductAttrs attrs={attrs} facets={formData.facets} setAttrs={setAttrs} groups={formData?.category.groups} />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Additional attributes
                  </Typography>
                </Box>

                {/* Dynamic forms for additional product attributes */}
                <Box sx={{ maxWidth: "1000px" }}>
                  <AdditionalProductAttrs additionalAttrs={extraAttrs} setAdditionalAttrs={setExtraAttrs} facetTypes={formData.facet_types} />
                </Box>

              </Box>
            )}

          </Box>

        )}

      </Box>
    </>
  )
}