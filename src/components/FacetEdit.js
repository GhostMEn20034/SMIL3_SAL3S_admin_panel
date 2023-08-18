import { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import { Box, Button, TextField, Alert } from "@mui/material";
import SelectValue from "./SelectValue";
import MultipleSelect from "./MultipleSelectValue";
import ChipsArray from "./ChipsArray";
import { useNavigate } from "react-router-dom";

export default function FacetEdit({ facet, categories }) {
    const [facetTypes, setFacetTypes] = useState([]);
    const [code, setCode] = useState(facet.code);
    const [name, setName] = useState(facet.name);
    const [type, setType] = useState(facet.type);
    const [optional, setOptional] = useState(facet.optional);
    const [values, setValues] = useState(facet.values);
    const [showInFilters, setShowInFilters] = useState(facet.show_in_filters);
    const [choosenCategories, setChoosenCategories] = useState(facet.categories);
    const [newFacetValue, setNewFacetValue] = useState("");
    const [error, setError] = useState("");

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
                categories: choosenCategories,
                values: values
            });
            navigate(-1);
        } catch (error) {
            if (error.response.status === 422) {
                setError("Make sure that all fields are not empty");
            } else {
                setError(error.response.data.error);
            }
        }
    }

    const removeValue = (index) => {
        setValues((prevValues) => {
            // Use the filter method to create a new array without the item at the given index
            return prevValues.filter((item, i) => i !== index);
        });
    };

    const addValue = (item) => {
        setValues((prevValues) => {
            return [...prevValues, item];
        });
        setNewFacetValue("");
    };

    const isFormValid = () => {
        return name.trim() && choosenCategories && values;
    }

    return (
        <>
            <Box>
                <Box>
                    <TextField value={code} label="Code" size="small" disabled />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" size="small" />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SelectValue value={type} setValue={setType} menuItems={facetTypes} label={"Type"} disabled={true}/>
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
                    <MultipleSelect value={choosenCategories === "*" ? [] : choosenCategories} setValue={setChoosenCategories}
                        objectKey={"_id"} objectValue={"name"} menuItems={categories} label={"Categories"} />
                </Box>
                {["list_string", "list_integer"].includes(type) && (
                    <Box sx={{ mt: 2 }}>
                        <Box display={"flex"}>
                            <TextField value={newFacetValue}
                                onChange={(e) => setNewFacetValue(e.target.value)}
                                label="New facet value"
                                size="small"
                                sx={{ mr: 2 }}
                            />
                            <Button size="small" color="primary" variant="contained"
                                onClick={() => addValue(newFacetValue)}
                                disabled={newFacetValue === ""}
                            >
                                Add new facet value
                            </Button>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <ChipsArray array={values} removeValue={removeValue} />
                        </Box>
                    </Box>
                )}
                {error && (
                <Box sx={{mt: 2}}>
                    <Alert severity="error" onClose={() => setError("")}>
                        {error}
                    </Alert>
                </Box>
                )}
                <Box sx={{mt: 2, mb: 2}}>
                    <Button variant="contained" size="large" color="primary"
                        disabled={!isFormValid()}
                        onClick={updateFacet}
                    >
                        Submit
                    </Button>
                </Box>

            </Box>
        </>
    )
}
