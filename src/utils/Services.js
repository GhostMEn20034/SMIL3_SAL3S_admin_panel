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

export const facetsToAttrs = (facets) => {

    let mapValueToFacetType = (facet) => {
        let value;

        switch (facet.type) {
            case "list":
                value = facet.values[0];
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
            default:
                value = ""
        }

        return value
    }

    let attrs = facets.map(facet => ({
        code: facet.code,
        name: facet.name,
        type: facet.type,
        value: mapValueToFacetType(facet),
        unit: facet.units ? facet.units[0] : null
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
    // newValue - new attribute value.
    // setAttrs - setState function
    setAttrs((prevAttrs) => {
        return [
            // Copy the elements before the index
            ...prevAttrs.slice(0, index),
            // Create a new object with the updated value for the index
            {
                ...prevAttrs[index],
                // update attribute unit
                unit: newValue
            },
            // Copy the elements after the index
            ...prevAttrs.slice(index + 1),
        ];
    });
};
