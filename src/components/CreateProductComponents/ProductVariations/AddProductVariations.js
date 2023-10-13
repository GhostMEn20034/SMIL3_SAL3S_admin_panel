import { Fragment, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { facetsToAttrs, arrayToMenuItems, handleChangeAttrGroup } from "../../../utils/Services";
import AttrInput from "../../ProductComponents/mapAttrTypeToComponent";
import SelectValue from "../../SelectValue";
import ProductVariationChips from "./ProductVariationChips";
import { generateCombinations, removeProducts } from "../../../utils/ProductVariationServices";

export default function AddProductVariations(props) {
    const [newFields, setNewFields] = useState(facetsToAttrs(props.facets)); // Fields for the new varition theme, list of objects
    const [groups, setGroups] = useState(() => newFields.map(field => field.group)); // Stores previous group values for each field


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
            removeProducts(newArray[index], props.setProductVariations);

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
        })
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