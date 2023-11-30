import { baseAttrs } from "./consts";
import { removeKey } from "./Services";


const generateProducts = (productVariationFields, newAttr) => {
  // Get the keys of the productVariationFields object as an array
  let keys = Object.keys(productVariationFields);

  if (keys.length === 0) {
    let product = { ...baseAttrs, attrs: [] };

    // Add the new attribute to the product attrs
    product.attrs.push(newAttr);

    return [product]
  }

  // Initialize an array to store the products
  let products = [];

  // Loop through each key in the keys array
  for (let key of keys) {
    // Get the array of values for the current key from the productVariationFields object
    let values = productVariationFields[key];

    // Initialize a temporary array to store the new products
    let temp = [];

    // Loop through each value in the values array
    for (let value of values) {
      // If the products array is empty, create a new product with an empty name, price, stock and attrs
      if (products.length === 0) {
        let product = { ...baseAttrs, attrs: [] };

        // Add the new attribute to the product attrs
        product.attrs.push(newAttr);

        // Add the current value to the product attrs
        product.attrs.push(value);

        // Push the product to the temporary array
        temp.push(product);
      } else {
        // If the products array is not empty, create a new product for each existing product and the current value in the values array
        // Loop through each existing product in the products array
        for (let product of products) {
          // Create a copy of the existing product
          let copy = JSON.parse(JSON.stringify(product));

          // Add the current value to the copy attrs
          copy.attrs.push(value);

          // Push the copy to the temporary array
          temp.push(copy);
        }
      }
    }

    // Replace the products array with the temporary array
    products = temp;
  }

  // Return the products array as the final output
  return products;
};


export const generateCombinations = (productVariationFields, setProductVariations, attr) => {
  /**
   * Generates combinations of the product variations based on attributes added by the user.
   * @param productVariationFields Object with already added product variation fields 
   * grouped by the facet code.
   * @param setProductVariations Setter function, that updates product variations.
   * @param attr New product variation field.
   */

  let keyName = attr.code; // Name of key in productVariationFields

  let noPropertyOrPropertyLengthLT1 = (
    !productVariationFields[keyName] ||
    productVariationFields[keyName]?.length < 1
  ); // returns true if no property with the name stored in the keyName
  // or if property with the name stored in the keyname has length less than 1.

  setProductVariations((prevValues) => {

    // If there are keys in the productVariationFields, but productVariations array is empty, 
    // return all product combinations.
    if (Object.keys(productVariationFields).length > 0 && prevValues?.length < 1) {
      return [
        ...generateProducts(removeKey(productVariationFields, keyName), attr)
      ];
    }

    // if no property with value attr.code in the productVariationFields 
    // and ProductVariations array is empty, then function creates a product variation with the 
    // new attribute in the ProductVariations array.
    if (noPropertyOrPropertyLengthLT1 && prevValues?.length < 1) {
        return [
          { ...baseAttrs, attrs: [attr,] }
        ];
    }

    // if no property with value attr.code in the productVariationFields, BUT
    // product variations already exist, then function adds the new attr to all existed variations.
    if (!productVariationFields[keyName] && prevValues.length > 0) {
      return prevValues.map((obj) => ({
        ...obj,
        attrs: [...obj.attrs, attr]
      }));
    }

    if (productVariationFields[keyName].length > 0 && prevValues.length > 0) {
      return [
        ...prevValues,
        ...generateProducts(removeKey(productVariationFields, keyName), attr)
      ];
    }
  });

};

// Removes all products variations that have the same attribute as passed into the function
export const removeProducts = (attr, setProductVariations) => {

  const hasAttribute = (obj, code, value, unit) => {
    // Loop through the attrs array of the object
    for (let attr of obj.attrs) {
      // Check if the attr matches the code, value, and unit
      if (attr.code === code && attr.value === value && attr.unit === unit) {
        // Return true if a match is found
        return true;
      }
    }
    // Return false if no match is found
    return false;
  };

  // Update the state with the new list of products
  setProductVariations((prevValues) => {
    let newProducts = prevValues.filter((product) => {
      // Return true if the product does not have the attribute
      return !hasAttribute(product, attr.code, attr.value, attr.unit);
    });

    return newProducts;
  });
};
