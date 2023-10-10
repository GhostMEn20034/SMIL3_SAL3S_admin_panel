import { baseAttrs } from "./consts";
import { removeKey } from "./Services";


const generateProducts = (productVariationFields, newAttr, products = [], index = 0) => {
  // Get the keys of the productVariationFields object as an array
  let keys = Object.keys(productVariationFields);

  if (keys.length === 0) {
    let product = { ...baseAttrs, attrs: [] };

     // Add the new attribute to the product attrs
     product.attrs.push(newAttr);

    return [product]
  }

  // If the index is equal to the length of the keys array, it means that we have reached the end of the recursion
  if (index === keys.length) {
    // Return the products array as the final output
    return products;
  }

  // Get the current key from the keys array at the index position
  let key = keys[index];

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



  // Increment the index by one
  index++;

  // Call the function recursively with the updated products and index parameters
  return generateProducts(productVariationFields, newAttr, products, index);
}


export const generateCombinations = (productVariationFields, setProductVariations, attr) => {
  /**
   * Generates combinations of the product variations based on attributes added by the user.
   * @param productVariationFields Object with already added product variation fields 
   * grouped by the facet code.
   * @param setProductVariations Setter function, that updates product variations.
   * @param attr New product variation field.
   */

  let keyName = attr.code; // Name of key in productVariationFields

  let noPropertyOrPropertyLengthLt1 = (
    !productVariationFields[keyName] ||
    productVariationFields[keyName]?.length < 1
  ); // returns true if no property with the name stored in the keyName
  // or if property with the name stored in the keyname has length less than 1.

  setProductVariations((prevValues) => {
    // if no property with value attr.code in the productVariationFields 
    // and ProductVariations array is empty, then function creates a product variation with the 
    // new attribute in the ProductVariations array
    if (noPropertyOrPropertyLengthLt1 && prevValues?.length < 1) {
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

    if (productVariationFields[keyName]?.length > 0 && prevValues.length > 0) {
      console.log("UWUUW")
      return [
        ...prevValues,
        ...generateProducts(removeKey(productVariationFields, keyName), attr)
      ];
    }
  });

};