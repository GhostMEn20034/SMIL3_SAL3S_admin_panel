import slugify from "voca/slugify";
import { extraAttr } from "./consts";

export default function findCategoryByID(id, data) {
    const category = data.find(element => element._id === id);
    const name = category?.name;

    return name;
}


export const addItemToChipsArray = (item, setValues, setNewItem) => {
    setValues((prevValues) => {
        return [...prevValues, item];
    });
    setNewItem("");
};

export const removeItemFromChipsArray = (index, setValues) => {
    setValues((prevValues) => {
        // Use the filter method to create a new array without the item at the given index
        return prevValues.filter((item, i) => i !== index);
    });
};

export const arrayToMenuItems = (array) => {
    // Use the map method to apply an arrow function to each element of the array
    let menuItems = array.map(element => ({
        name: element,
        value: element
    }));

    // Return the list
    return menuItems;
};

const mapValueToFacetType = (facet) => {
    let value;

    switch (facet.type) {
        case "list":
            value = [];
            break;
        case "string":
            value = "";
            break;
        case "decimal":
            value = 0.00;
            break;
        case "integer":
            value = 0;
            break;
        case "bivariate":
            value = [0, 0];
            break;
        case "trivariate":
            value = [0, 0, 0];
            break;
        default:
            value = ""
    }

    return value
}

export const facetsToAttrs = (facets) => {

    let attrs = facets.map(facet => ({
        code: facet.code,
        name: facet.name,
        type: facet.type,
        value: mapValueToFacetType(facet),
        optional: facet.optional,
        unit: facet.units ? facet.units[0] : null,
        group: null
    }));

    return attrs;
}


export const handleChangeAttrs = (index, newValue, setAttrs, valueIndex) => {
    // index - index of product attribute.
    // newValue - new attribute value.
    // setAttrs - setState function
    // valueIndex - Value index, optional parameter, used only for bivariate attributes.

    setAttrs((prevAttrs) => {
        return [
            // Copy the elements before the index
            ...prevAttrs.slice(0, index),
            // Create a new object with the updated value for the index
            {
                ...prevAttrs[index],
                // If valueIndex is defined, use it to update the value array at the given index
                // Otherwise, use newValue as the value
                value: valueIndex !== undefined ? [
                    // Copy the elements before the valueIndex
                    ...prevAttrs[index].value.slice(0, valueIndex),
                    // Use newValue as the new element at the valueIndex
                    newValue,
                    // Copy the elements after the valueIndex
                    ...prevAttrs[index].value.slice(valueIndex + 1),
                ] : newValue,
            },
            // Copy the elements after the index
            ...prevAttrs.slice(index + 1),
        ];
    });
};


export const handleChangeAttrUnit = (index, newValue, setAttrs) => {
    // index - index of product attribute.
    // newValue - new attribute unit.
    // setAttrs - setState function
    setAttrs((prevAttrs) => {
        return [
            // Copy the elements before the index
            ...prevAttrs.slice(0, index),
            // Create a new object with the updated value for the index
            {
                ...prevAttrs[index],
                // update attribute unit
                unit: newValue === "" ? null : newValue
            },
            // Copy the elements after the index
            ...prevAttrs.slice(index + 1),
        ];
    });
};


export const handleChangeAttrName = (index, newValue, setAttrs) => {
    // index - index of product attribute.
    // newValue - new attribute name.
    // setAttrs - setState function
    setAttrs((prevAttrs) => {
        return [
            // Copy the elements before the index
            ...prevAttrs.slice(0, index),
            // Create a new object with the updated value for the index
            {
                ...prevAttrs[index],
                // update attribute name
                name: newValue,
                code: slugify(newValue),
            },
            // Copy the elements after the index
            ...prevAttrs.slice(index + 1),
        ];
    });
};

export const handleChangeAttrGroup = (index, newValue, setAttrs) => {
    // index - index of product attribute.
    // newValue - new attribute Group.
    // setAttrs - setState function
    setAttrs((prevAttrs) => {
        return [
            // Copy the elements before the index
            ...prevAttrs.slice(0, index),
            // Create a new object with the updated value for the index
            {
                ...prevAttrs[index],
                // update attribute group
                group: newValue
            },
            // Copy the elements after the index
            ...prevAttrs.slice(index + 1),
        ];
    });
};

export const handleChangeAttrType = (index, newValue, setAttrs) => {
    // index - index of product attribute.
    // newValue - new attribute type.
    // setAttrs - setState function
    setAttrs((prevAttrs) => {
        return [
            // Copy the elements before the index
            ...prevAttrs.slice(0, index),
            // Create a new object with the updated value for the index
            {
                ...prevAttrs[index],
                // update attribute name
                type: newValue,
                value: mapValueToFacetType({ type: newValue })
            },
            // Copy the elements after the index
            ...prevAttrs.slice(index + 1),
        ];
    });
};


export const removeAttr = (index, setAttrs) => {
    // index - index of element to remove
    // setAttrs - function to set state of the attrs
    setAttrs((prevAttrs) => {
        // Make a copy of the state array
        let newAttrs = [...prevAttrs];
        // Remove the element at the given index using splice
        newAttrs.splice(index, 1);

        // If the new array has length 0, then return object extraAttr
        if (newAttrs.length === 0) {
            return [extraAttr]
        }

        // Return the new array as the new state
        return newAttrs;
    });
};

export const addAttr = (setAttrs, data) => {
    // setAttrs - function to set state of the attrs
    // data - object that will be inserted as new attrs array element

    setAttrs((prevAttrs) => {
        return [...prevAttrs, data];
    });
};


export const getArrayElems = (arrayOfObj, propertyName) => {
    // returns flatten array of elements from array of objects
    // arrayOfObj - array of objects.
    // propertyName - Name of property (array) where values are stored

    if (arrayOfObj.length === 0) {
        return [];
    }

    let result = [];

    for (let obj of arrayOfObj) {
        result = [...result, ...obj[propertyName]];
    }

    // Return the result array
    return result;
}


export const addListValue = (index, newValue, setAttrs) => {
    setAttrs((prevAttrs) => {
        return [
            // Copy the elements before the index
            ...prevAttrs.slice(0, index),
            // Create a new object with the updated value for the index
            {
                ...prevAttrs[index],
                // update value array
                value: [...prevAttrs[index].value, newValue]
            },
            // Copy the elements after the index
            ...prevAttrs.slice(index + 1),
        ]
    });
};


export const removeKey = (obj, key) => {
    // Create a new object to store the result
    let result = {};
    // Loop through the keys of the original object
    for (let k in obj) { //
        // If the key is not equal to the one to be removed, copy it to the result object
        if (k !== key) {
            result[k] = obj[k];
        }
        // Return the result object

    }

    return result;
};

// Returns a string with the attribute values, names and units for a product name
export const getAttrString = (attrs, separator) => {
    // Create an array of strings with the attribute values, names and units
    let attrStrings = attrs.map(attr => {
        
        let unit = attr.unit;
        let value = attr.value;
        let name = attr.name;

        // if attribute type is bivariate or trivariate
        if (["bivariate", "trivariate"].includes(attr.type)) {            
            value = value.join(" x ");
        }

        // If the unit is null, return only the value and name
        if (unit === null) {
            return `${value} ${name}`;
        }
        // Otherwise, return the value, name and unit
        else {
            return `${value} ${unit} ${name}`;
        }
    });
    // Join the attrStrings array with the separator
    let attrString = attrStrings.join(separator);
    // Return the attrString
    return attrString;
}

// Modifies name for each productVariation based on the chosen attrs
export const modifyName = (attrs, separator, checkedProducts, setProductVariations, addVariationAttrs) => {
    /**
     * @param attrs: array of objects, stores list of product attributes that will used to in the product name.
     * @param separator: string, symbol to separate attrs in the product name.
     * @param checkedProducts: array of integers, list of indexes of checked products.
     * @param setProductVariations: react setState function.
     * @param addVariationAttrs: boolean, defines whether include product variation attrs to the product name.
     */

    setProductVariations((prevValues) => {
        let newProducts = prevValues.map((product, index) => {
            if (checkedProducts.includes(index)) {
                let concatenatedAttrs = addVariationAttrs ? attrs.concat(product.attrs) : attrs; // if addVariationAttrs is true, 
                // then add product variation attrs to the attrs passed to the function
                let attrString = getAttrString(concatenatedAttrs, separator);
                let newName = product.name + " " + attrString;
                // Return a new object with the modified name
                return {...product, name: newName};
            } else {
                return product;
            }
        });
        return newProducts;
    });
}
