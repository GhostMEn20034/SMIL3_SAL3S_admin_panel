export const changeRangeValue = (rangeValues, index, key, value) => {
    let newRangeValues;
    if (!rangeValues) {
        newRangeValues = [];
    } else {
        newRangeValues = rangeValues;
    }

    if (key === 'gteq' && value === 0) {
        value = null;
    }

    return newRangeValues.map((newRangeValue, rangeValueIndex) => {
        if (index === rangeValueIndex) {
            return {
                ...newRangeValue,
                [key]: value,
            };
        }

        return newRangeValue;
    })
};

export const addRangeValue = (rangeValues, gteq, ltn, displayName) => {
    let newRangeValues;
    if (!rangeValues) {
        newRangeValues = [];
    } else {
        newRangeValues = rangeValues;
    }

    return [
        ...newRangeValues,
        { gteq, ltn, display_name: displayName },
    ];
};

export const removeRangeValue = (rangeValues, index) => {
    return rangeValues.filter((_, i) => i !== index);
};


export const generateDisplayNameForRangeValues = (rangeValues, unit) => {
    /**
     * @param rangeValues - Array of Objects
     */
    return rangeValues.map((rangeValue) => {
        let displayName;
        if (rangeValue?.gteq === 0 && rangeValue?.ltn > 0) {
            displayName = `Up to ${rangeValue?.ltn}` + (unit ? ` ${unit}` : "");
        } else if (rangeValue?.gteq > 0 && rangeValue?.ltn > 0) {
            displayName = `${rangeValue?.gteq} to ${rangeValue?.ltn}` + (unit ? ` ${unit}` : "");
        } else if (rangeValue?.gteq > 0 && rangeValue?.ltn === null) {
            displayName = `${rangeValue?.gteq}` + (unit ? ` ${unit}` : "") + " & Above";
        }

        return {
            ...rangeValue,
            display_name: displayName,
        };
    });


};
