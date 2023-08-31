import { Box, TextField, Button, Alert } from "@mui/material";
import SelectValue from "../SelectValue";
import MultipleSelect from "../MultipleSelectValue";
import { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import { useNavigate } from "react-router-dom";
import ChipsArray from "../ChipsArray";
import slugify from "voca/slugify";


export default function AddFacet() {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("string");
    const [values, setValues] = useState([]);
    const [chosenCategories, setChosenCategories] = useState([]);
    const [optional, setOptional] = useState(false);
    const [showInFilters, setShowInFilters] = useState(true);
    const [newFacetValue, setNewFacetValue] = useState("");
    const [facetTypes, setFacetTypes] = useState([]);
    const [categories, setCategories] = useState([]);
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

    const getCategories = async () => {
        try {
            let response = await api.get(`/categories/for-choices`);
            let data = await response.data;
            setCategories(data);
        } catch {
            console.log("Something went wrong");
        }
    };


    const addFacet = async () => {
        setErrors({});
        let bodyData = {
            name: name,
            code: code,
            type: type,
            optional: optional,
            show_in_filters: showInFilters,
            categories: chosenCategories.length > 0 ? chosenCategories : "*",
            values: ["list_string", "list_integer"].includes(type) ? values : null
        };
        
        try {
            await api.post("/facets/", bodyData);
            navigate(-1);
        } catch (error) {
            setErrors(error.response.data.errors);
        }
    };

    useEffect(() => {
        getCategories();
        getFacetTypes();
    }, []);

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

    const handleChangeName = (e) => {
        setName(e.target.value);
        setCode(slugify(e.target.value));
    };

    const fields = [
        { value: code, setValue: null, label: "Code", disabled: true, error: errors.code !== undefined, helperText: errors.name ? errors.name : "" },
        { value: name, setValue: handleChangeName, label: "Name", disabled: false, error: errors.name !== undefined, helperText: errors.name ? errors.name : "" }
    ]

    return (
        <Box>
            {fields.map((field, index) => (
                <Box sx={{mt: index !== 0 ? 2 : 0}}>
                    <TextField error={field.error} value={field.value} onChange={field.setValue} label={field.label} disabled={field.disabled} helperText={field.helperText} />
                </Box>
            ))}
            <Box sx={{ mt: 2 }}>
                <SelectValue value={type} setValue={setType} menuItems={facetTypes} label={"Type"} />
            </Box>
            <Box sx={{ mt: 2 }}>
                <MultipleSelect value={chosenCategories === "*" ? [] : chosenCategories} setValue={setChosenCategories}
                    objectKey={"_id"} objectValue={"name"} menuItems={categories} label={"Categories"} error={errors.categories !== undefined} helperText={errors.categories ? errors.categories : ""}/>
            </Box>
            {["list_string", "list_integer"].includes(type) && (
                <Box sx={{ mt: 2 }}>
                    <Box display={"flex"}>
                        <TextField value={newFacetValue}
                            error={errors.values !== undefined}
                            helperText={errors.values ? errors.values : ""}
                            onChange={(e) => setNewFacetValue(e.target.value)}
                            label="New facet value"
                            size="small"
                            sx={{ mr: 2 }}
                        />
                        <Button size="small" color="primary" variant="contained" sx={{maxHeight: "40px"}}
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
                <Button variant="contained" onClick={() => addFacet()}>
                    Submit
                </Button>
            </Box>
        </Box>
    )

}
