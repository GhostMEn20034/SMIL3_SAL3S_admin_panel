import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { Box, Typography } from "@mui/material";
import { facetsToAttrs } from "../utils/Services";
import SelectValueRadioGroup from "../components/SelectValueRadioGroup";
import SelectValue from "../components/SelectValue";
import ProductAttrs from "../components/CreateProductComponents/ProductAttrs";

export default function CreateProductPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(null); // Data required to create a product
  const [hasVariations, setHasVariations] = useState(false); // Determine whether product has variations
  const [variationTheme, setVariationTheme] = useState(null); // Chosen variation theme
  const [baseAttrs, setBaseAttrs] = useState([]); // Base attributes such as product name, price, sku etc
  const [attrs, setAttrs] = useState([]); // Product specs, for example: screen size, CPU, storage size etc 

  const api = useAxios('products');
  const navigate = useNavigate();

  const getFormData = async () => {
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
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  useEffect(() => {
    if (!searchParams.get("categoryID")) {
      navigate(-1);
    }
    getFormData();
  }, []);

  console.log(attrs);
  console.log(variationTheme);

  return (
    <>
      <Box padding={2}>
        <Typography variant="h4">
          Create product
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">

        <Box>
          <Box sx={{ mb: 1 }}>
            <SelectValueRadioGroup label={"Does product has Variations?"} value={hasVariations} setValue={setHasVariations} menuItems={[
              { name: "No", value: false },
              { name: "Yes", value: true }
            ]} valueType={"boolean"}/>
          </Box>
          {hasVariations && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                  Variation theme
              </Typography>
              <SelectValue value={variationTheme ? variationTheme : ""} setValue={setVariationTheme} menuItems={formData.variation_themes} objectKey={"_id"} />
            </Box>
          )}
          <Box sx={{ maxWidth: "700px" }}>
            {formData && (
              <ProductAttrs attrs={attrs} facets={formData.facets} setAttrs={setAttrs} />
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}