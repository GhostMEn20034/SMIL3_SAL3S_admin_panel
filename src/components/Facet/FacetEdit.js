import { useState, useEffect } from "react";
import { Box, Button, TextField, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import SelectValue from "../SelectValue";
import MultipleSelect from "../MultipleSelectValue";
import ChipsArray from "../ChipsArray";
import { addItemToChipsArray, removeItemFromChipsArray } from "../../utils/Services";
import { changeRangeValue, addRangeValue, removeRangeValue, generateDisplayNameForRangeValues } from "../../utils/facetUtils/rangeValues";
import useAxios from "../../utils/useAxios";
import Textarea from "../TextArea";
import RangeValuesEdit from "./RangeValuesEdit";
import ObjectValueExtractor from "../../utils/objectValueExtractor";

export default function FacetEdit({ facet, categories }) {
    const [facetTypes, setFacetTypes] = useState([]);

    const [code, setCode] = useState(facet.code);
    const [name, setName] = useState(facet.name);
    const [type, setType] = useState(facet.type);

    const [optional, setOptional] = useState(facet.optional);
    const [showInFilters, setShowInFilters] = useState(facet.show_in_filters);

    const [facetValues, setFacetValues] = useState(facet.values ? facet.values : []);
    const [newFacetValue, setNewFacetValue] = useState("");

    const [newUnitValue, setNewUnitValue] = useState("");
    const [units, setUnits] = useState(facet.units === null ? [] : facet.units);
    const [unitsIsNull, setUnitsIsNull] = useState(facet.units === null);

    const [chosenCategories, setChosenCategories] = useState(facet.categories);
    const [explanation, setExplanation] = useState(facet.explanation ? facet.explanation : "");

    const [isRange, setIsRange] = useState(facet.is_range);
    const [rangeValues, setRangeValues] = useState(facet.range_values);

    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));

    const api = useAxios('products');
    const navigate = useNavigate();

    const getFacetTypes = async () => {
        try {
            let response = await api.get('/admin/facet-types/');
            let data = await response.data;
            setFacetTypes(data)
        } catch {
            console.log("Something went wrong");
        }
    };

    useEffect(() => {
        getFacetTypes();
    }, []);

    const updateFacet = async () => {
        try {
            await api.put(`/admin/facets/${facet._id}`, {
                name: name,
                optional: optional,
                show_in_filters: showInFilters,
                categories: chosenCategories.length > 0 ? chosenCategories : "*",
                explanation: explanation.trim().length < 1 ? null : explanation,
                values: facetValues.length > 0 ? facetValues : null,
                units: !unitsIsNull && units.length > 0 ? units : null,
                is_range: isRange,
                range_values: isRange ? rangeValues : null,
            });
            navigate(-1);
        } catch (err) {
            let baseErrors = err.response.data?.base_errors;
            setErrorHandler(() => {
                if (baseErrors) {
                    return new ObjectValueExtractor(err.response.data.errors, true);
                } else {
                    return new ObjectValueExtractor(err.response.data.detail, false);
                }
            });
        }
    };

    const handleChangeRangeValue = (index, key, value) => {
        setRangeValues((prevValues) => {
            return changeRangeValue(prevValues, index, key, value);
        });
    };

    const handleAddRangeValue = (gteq, ltn, displayName) => {
        setRangeValues((prevValues) => {
            return addRangeValue(prevValues, gteq, ltn, displayName);
        });
    };

    const handleRemoveRangeValue = (index) => {
        setRangeValues((prevValues) => {
            let newValues = removeRangeValue(prevValues, index);
            if (newValues.length > 0) {
                return newValues;
            }
            return null;
        });
    };

    const generateRangeValueDisplayName = () => {
        setRangeValues((prevValues) => {
            return generateDisplayNameForRangeValues(
                prevValues, units.length > 0 ? units[0] : null
            );
        });
    };

    return (
        <>
            <Box>
                <Box>
                    <TextField value={code} label="Code" size="small" disabled />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TextField 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        label="Name" size="small" 
                        error={errorHandler.isValueExist("name")} 
                        helperText={errorHandler.getObjectValue("name")} 
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SelectValue 
                        value={type} 
                        setValue={setType} 
                        menuItems={facetTypes} 
                        label={"Type"} 
                        disabled={true} 
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SelectValue value={optional} setValue={setOptional} menuItems={[
                        { "value": true, "name": "Yes" },
                        { "value": false, "name": "No" }
                    ]} label={"Optional"} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SelectValue value={showInFilters} setValue={setShowInFilters} menuItems={[
                        { "value": true, "name": "Yes" },
                        { "value": false, "name": "No" }
                    ]} label={"Show in filters"} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <MultipleSelect value={chosenCategories === "*" ? [] : chosenCategories} setValue={setChosenCategories}
                        objectKey={"_id"} objectValue={"name"} menuItems={categories} label={"Categories"} />
                </Box>
                <Typography sx={{ mt: 1 }} variant="body2">
                    * An empty list of categories means that facet can be used for a product with any category
                </Typography>
                {type === 'string' && (
                    <Box sx={{ mt: 2 }}>
                        <Box display={"flex"}>
                            <TextField value={newFacetValue}
                                onChange={(e) => setNewFacetValue(e.target.value)}
                                label="New facet value"
                                size="small"
                                error={errorHandler.isValueExist("values")}
                                helperText={errorHandler.getObjectValue("values")}
                                sx={{ mr: 2 }}
                            />
                            <Button size="small" color="primary" variant="contained" sx={{ maxHeight: "40px" }}
                                onClick={() => addItemToChipsArray(newFacetValue, setFacetValues, setNewFacetValue)}
                                disabled={newFacetValue === ""}
                            >
                                Add new facet value
                            </Button>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <ChipsArray array={facetValues} removeValue={(index) => removeItemFromChipsArray(index, setFacetValues)} />
                        </Box>
                    </Box>
                )}
                <Box sx={{ mt: 1 }}>
                    <FormControlLabel control={
                        <Checkbox checked={unitsIsNull} onChange={() => setUnitsIsNull(!unitsIsNull)} />
                    } label="Facet has no units" />
                </Box>
                {!unitsIsNull && (
                    <Box sx={{ mt: 2 }}>
                        <Box display={"flex"}>
                            <TextField value={newUnitValue}
                                onChange={(e) => setNewUnitValue(e.target.value)}
                                label="New unit value"
                                size="small"
                                sx={{ mr: 2 }}
                            />
                            <Button size="small" color="primary" variant="contained" sx={{ maxHeight: "40px" }}
                                onClick={() => addItemToChipsArray(newUnitValue, setUnits, setNewUnitValue)}
                                disabled={newUnitValue === ""}
                            >
                                Add new unit value
                            </Button>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <ChipsArray array={units} removeValue={(index) => removeItemFromChipsArray(index, setUnits)} />
                        </Box>
                    </Box>
                )}
                <Box sx={{ mt: 2 }}>
                    <Textarea value={explanation} setValue={setExplanation}
                        placeholder={"Add a facet explanation... (Optional)"} minRows={5}
                        sx={{ width: 450 }} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <RangeValuesEdit
                        isRange={isRange}
                        setIsRange={setIsRange}
                        type={type}
                        rangeValues={rangeValues}
                        setRangeValues={handleChangeRangeValue}
                        AddRangeValue={handleAddRangeValue}
                        removeRangeValue={handleRemoveRangeValue}
                        generateRangeValueDisplayName={generateRangeValueDisplayName}
                        errorHandler={errorHandler}
                    />
                </Box>
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Button variant="contained" size="large" color="primary"
                        onClick={updateFacet}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </>
    )
}
