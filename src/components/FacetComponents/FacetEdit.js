import { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import { Box, Button, TextField, FormControlLabel, Checkbox } from "@mui/material";
import SelectValue from "../SelectValue";
import MultipleSelect from "../MultipleSelectValue";
import ChipsArray from "../ChipsArray";
import { useNavigate } from "react-router-dom";
import { addItemToChipsArray, removeItemFromChipsArray } from "../../utils/FacetServices";

export default function FacetEdit({ facet, categories }) {
    const [facetTypes, setFacetTypes] = useState([]);

    const [code, setCode] = useState(facet.code);
    const [name, setName] = useState(facet.name);
    const [type, setType] = useState(facet.type);

    const [optional, setOptional] = useState(facet.optional);
    const [showInFilters, setShowInFilters] = useState(facet.show_in_filters);

    const [facetValues, setFacetValues] = useState(facet.values);
    const [newFacetValue, setNewFacetValue] = useState("");

    const [newUnitValue, setNewUnitValue] = useState("");
    const [units, setUnits] = useState(facet.units === null ? [] : facet.units);
    const [unitsIsNull, setUnitsIsNull] = useState(facet.units === null);

    const [chosenCategories, setChosenCategories] = useState(facet.categories);

    const [errors, setErrors] = useState({});

    const api = useAxios('products');
    const navigate = useNavigate();

    const getFacetTypes = async () => {
        try {
            let response = await api.get('/facet-types/');
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
            await api.put(`/facets/${facet._id}`, {
                name: name,
                optional: optional,
                show_in_filters: showInFilters,
                categories: chosenCategories.length > 0 ? chosenCategories : "*",
                values: facetValues,
                units: !unitsIsNull && units.length > 0 ? units : null,
            });
            navigate(-1);
        } catch (error) {
            console.log(error);
            setErrors(error.response.data.errors);
        }
    };

    return (
        <>
            <Box>
                <Box>
                    <TextField value={code} label="Code" size="small" disabled />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" size="small" error={errors.name !== undefined} helperText={errors.name ? errors.name : ""} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SelectValue value={type} setValue={setType} menuItems={facetTypes} label={"Type"} disabled={true} />
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
                {type === 'list' && (
                    <Box sx={{ mt: 2 }}>
                        <Box display={"flex"}>
                            <TextField value={newFacetValue}
                                onChange={(e) => setNewFacetValue(e.target.value)}
                                label="New facet value"
                                size="small"
                                error={errors.values !== undefined}
                                helperText={errors.values ? errors.values : ""}
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
                <Box sx={{ mt: 2 }}>
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
