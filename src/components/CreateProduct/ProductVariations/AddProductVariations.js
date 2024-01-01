import { Fragment, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { facetsToAttrs, arrayToMenuItems, handleChangeAttrGroup } from "../../../utils/Services";
import AttrInput from "../../Product/mapAttrTypeToComponent";
import SelectValue from "../../SelectValue";
import ProductVariationChips from "./ProductVariationChips";
import { generateCombinations, removeProducts } from "../../../utils/ProductVariationServices";

export default function AddProductVariations(props) {
    /**
     * Params:
     * facets - Array of facets
     * productVariationFields - Values of product fields that included to variation theme
     * setProductVariationFields - set function for productVariationFields
     * productVariations - Array of product variations.
     * setProductVariations - set function for productVariations.
     * groups - List of groups, user can assign group for each attribute.
     * callbackOnDelete - (OPTIONAL) Function that need to be executed on removal of product variations
     * keysForCallback - (OPTIONAL) keys which will be used for getting value from each object, suppose keyForCallback = ["id","name"],
     * then list of  objects with "name" and "id" properties will be passed to the callback function. If keyForCallback is undefined, then the list of whole objects
     * will passed to the callback function.
     */
    const [newFields, setNewFields] = useState(facetsToAttrs(props.facets)); // Fields for the new varition theme, list of objects
    const [groups, setGroups] = useState(() => newFields.map(field => field.group)); // Stores group values for each field


    const addProductVariationFields = (attr, keyName) => {

        props.setProductVariationFields((prevValues) => {

            setNewFields(() => {
                let updatedNewFields = facetsToAttrs(props.facets).map((attr, index) => {
                    // Copy the attr object and update the group property
                    let updatedAttr = { ...attr, group: groups[index] };
                    // Return the updated attr object
                    return updatedAttr;
                });

                return updatedNewFields;
            });

            let newObject = {
                ...prevValues,
                [keyName]: [...(prevValues[keyName] || []), attr] // Add new attribute to array located in specified property
            };
            
            generateCombinations(prevValues, props.setProductVariations, attr);
            return newObject
        });
    };

    const delProductVariationFields = (keyName, index) => {
        // deletes product variation fields
        props.setProductVariationFields((prevValues) => {
            // Make a copy of the array
            const newArray = [...prevValues[keyName]];
            
            // remove all products where code, value, unit the same as in the attribute to delete
            let deletedProducts = removeProducts(newArray[index], props.setProductVariations);

            // Execute callback function's code if callbackOnDelete property is function
            if (props.callbackOnDelete instanceof Function) {
                let callbackArg;
                // if there are keys that should be passed into the each object
                if (props.keysForCallback?.length > 0) {
                    // then return an array of objects with the specified properties.
                    callbackArg = deletedProducts.map((deletedProduct) => {
                        // Create a new object to store the desired fields
                        let objToReturn = {};

                        // Iterate through the specified keys
                        for (const key of props.keysForCallback) {
                            // Check if the key exists in the original object
                            if (key in deletedProduct) {
                                // Add the key-value pair to the new object
                                objToReturn[key] = deletedProduct[key];
                            }
                        }
                        return objToReturn;
                    });
                } else {
                    // Otherwise, use an array of the whole objects as callback argument
                    callbackArg = deletedProducts;
                }
                // execute function's code with callback argument
                props.callbackOnDelete(callbackArg);
            }

            // Remove the element at index
            newArray.splice(index, 1);

            // if array in the keyName has length 0
            if (newArray.length === 0) {
                // remove key from the object
                return {};

            } else {
                // Otherwise return object but with modified array in the keyName
                return {
                    ...prevValues,
                    [keyName]: newArray
                };
            }
        });
    };

    return (
        <Box
            sx={{
                display: "flex", justifyContent: "center",
                alignItems: "center", boxShadow: 3, padding: 3
            }}
        >
            <Box>
                <Box>
                    <Typography variant="body1">
                        Add product variations
                    </Typography>
                </Box>
                <Box>
                    {newFields.map((newField, index) => (
                        <Fragment key={index}>
                            <Stack key={index} sx={{ mt: 2 }} direction="row">
                                <AttrInput attr={newField} facet={props.facets.find(facet => facet.code === newField.code)} index={index} setAttrs={setNewFields} />
                                <Stack sx={{ ml: 1 }}>
                                    <SelectValue label={"Group"} value={newField.group ? newField.group : ""} setValue={(newValue) => {
                                        handleChangeAttrGroup(index, newValue, setNewFields);
                                        setGroups((prevValues) => {
                                            prevValues[index] = newValue;
                                            return prevValues;
                                        });
                                    }}
                                        menuItems={[
                                            { name: "No group", value: null },
                                            ...arrayToMenuItems(props.groups)
                                        ]}
                                    />
                                </Stack>
                                <Button key={index} variant="outlined"
                                    size="small" sx={{ ml: 2 }}
                                    onClick={() => addProductVariationFields(newField, newField.code)}
                                >
                                    Add {newField.name}
                                </Button>
                            </Stack>
                            {props.productVariationFields[newField.code] && (
                                <Box key={`${index}-BOX`}>
                                    <ProductVariationChips key={index} attrs={props?.productVariationFields[newField.code]} delProductVariationField={(index) => delProductVariationFields(newField.code, index)} />
                                </Box>
                            )}
                        </Fragment>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}