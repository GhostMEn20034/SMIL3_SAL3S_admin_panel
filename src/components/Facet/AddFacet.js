import {
    Box, TextField, Button,
    Checkbox, FormControlLabel,
    Typography
} from "@mui/material";
import slugify from "voca/slugify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Textarea from "../TextArea";
import useAxios from "../../utils/useAxios";
import SelectValue from "../SelectValue";
import MultipleSelect from "../MultipleSelectValue";
import ChipsArray from "../ChipsArray";
import { removeItemFromChipsArray, addItemToChipsArray } from "../../utils/Services";
import { changeRangeValue, addRangeValue, removeRangeValue, generateDisplayNameForRangeValues } from "../../utils/facetUtils/rangeValues";
import RangeValuesEdit from "./RangeValuesEdit";
import ObjectValueExtractor from "../../utils/objectValueExtractor";



export default function AddFacet() {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("string");

    const [facetValues, setFacetValues] = useState([]);
    const [newFacetValue, setNewFacetValue] = useState("");

    const [newUnitValue, setNewUnitValue] = useState("");
    const [units, setUnits] = useState([]);
    const [unitsIsNull, setUnitsIsNull] = useState(true);

    const [chosenCategories, setChosenCategories] = useState([]);
    const [explanation, setExplanation] = useState("");

    const [optional, setOptional] = useState(false);
    const [showInFilters, setShowInFilters] = useState(true);

    const [facetTypes, setFacetTypes] = useState([]);
    const [categories, setCategories] = useState([]);

    const [isRange, setIsRange] = useState(false);
    const [rangeValues, setRangeValues] = useState(null);

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

    const getCategories = async () => {
        try {
            let response = await api.get(`/admin/categories/for-choices`);
            let data = await response.data;
            setCategories(data);
        } catch {
            console.log("Something went wrong");
        }
    };


    const addFacet = async () => {
        // Request Body
        let body = {
            name: name,
            code: code,
            type: type,
            optional: optional,
            show_in_filters: showInFilters,
            categories: chosenCategories.length > 0 ? chosenCategories : "*",
            explanation: explanation.trim().length < 1 ? null : explanation,
            values: facetValues.length > 0 ? facetValues : null,
            units: !unitsIsNull && units.length > 0 ? units : null,
            is_range: isRange,
            range_values: isRange ? rangeValues : null,
        };

        try {
            await api.post("/admin/facets/", body);
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


    useEffect(() => {
        getCategories();
        getFacetTypes();
    }, []);

    const handleChangeName = (e) => {
        setName(e.target.value);
        setCode(slugify(e.target.value));
    };

    const fields = [
        { value: code, setValue: null, label: "Code", disabled: true, error: errorHandler.isValueExist("code"), helperText: errorHandler.getObjectValue("code") },
        { value: name, setValue: handleChangeName, label: "Name", disabled: false, error: errorHandler.isValueExist("name"), helperText: errorHandler.getObjectValue("name") }
    ];

    return (
        <Box>
            {fields.map((field, index) => (
                <Box sx={{ mt: index !== 0 ? 2 : 0 }} key={index}>
                    <TextField error={field.error} value={field.value} onChange={field.setValue} label={field.label} disabled={field.disabled} helperText={field.helperText} size="small" />
                </Box>
            ))}
            <Box sx={{ mt: 2 }}>
                <SelectValue value={type} setValue={setType} menuItems={facetTypes} label={"Type"} />
            </Box>
            <Box sx={{ mt: 2 }}>
                <MultipleSelect value={chosenCategories === "*" ? [] : chosenCategories} setValue={setChosenCategories}
                    objectKey={"_id"} objectValue={"name"} menuItems={categories} label={"Categories"} error={errorHandler.isValueExist("categories")} helperText={errorHandler.getObjectValue("categories")} />
            </Box>
            <Typography sx={{ mt: 1 }} variant="body2">
                * An empty list of categories means that facet can be used for a product with any category
            </Typography>
            {type === 'string' && (
                <Box sx={{ mt: 2 }}>
                    <Box display={"flex"}>
                        <TextField value={newFacetValue}
                            error={errorHandler.isValueExist("values")}
                            helperText={errorHandler.getObjectValue("values")}
                            onChange={(e) => setNewFacetValue(e.target.value)}
                            label="New facet value"
                            size="small"
                            sx={{ mr: 2 }}
                        />
                        <Button size="small" color="primary" variant="contained" sx={{ maxHeight: "40px" }}
                            onClick={() => addItemToChipsArray(newFacetValue, setFacetValues, setNewFacetValue)}
                            disabled={newFacetValue === ""}
                        >
                            Add new facet value
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2, maxWidth: "500px" }}>
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
            <Box sx={{ my: 2 }}>
                <Button variant="contained" onClick={() => addFacet()}>
                    Submit
                </Button>
            </Box>

        </Box>
    )

}
