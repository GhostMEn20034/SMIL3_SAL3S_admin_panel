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
