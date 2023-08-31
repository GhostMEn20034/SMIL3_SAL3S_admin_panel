import { useState, useEffect, Fragment } from "react";
import { Box, TextField, IconButton, Typography, Divider, Alert, Button } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MultipleSelect from "../MultipleSelectValue";
import useAxios from "../../utils/useAxios";
import { useNavigate } from "react-router-dom";
import slugify from "voca/slugify";


export default function AddVariationTheme() {
    const [name, setName] = useState("");
    const [filters, setFilters] = useState([{ name: "", field_codes: [] }]);
    const [chosenCategories, setChosenCategories] = useState([]);
    const [facets, setFacets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState([]);

    const api = useAxios('products');
    const navigate = useNavigate();


    const getCategories = async () => {
        try {
            let response = await api.get(`/categories/for-choices`);
            let data = await response.data;
            setCategories(data);
        } catch {
            console.log("Something went wrong");
        }
    };

    const getFacets = async () => {
        try {
            let response = await api.get("/facets/for-choices");
            let data = await response.data;
            setFacets(data);
        } catch (error) {
            console.log("Something went wrong");
        }
    };

    useEffect(() => {
        getFacets();
        getCategories();
    }, []);


    const changeFieldCodes = (value, indexTarget) => {
        let newFilters = filters.map((filter, index) => {
            if (index === indexTarget) {

                return {
                    ...filter,
                    field_codes: value
                };

            } else {
                return filter;
            }
        });
        setFilters(newFilters);
    };

    const changeFilterName = (value, indexTarget) => {
        let newFilters = filters.map((filter, index) => {
            if (index === indexTarget) {
                return {
                    ...filter,
                    name: value
                };
            } else {
                return filter;
            }
        });

        setFilters(newFilters);
    };

    const removeFilter = (indexTarget) => {
        setFilters(prevFilter => {

            // Make a copy of the previous array
            const newArr = [...prevFilter];

            // Remove one element starting from indexTarget
            newArr.splice(indexTarget, 1);

            if (newArr.length > 0) {
                // Return the new array
                return newArr
            }

            return [{ name: "", field_codes: [] }]

        })
    };


    const addFilter = () => {
        setFilters([...filters, { name: "", field_codes: [] }]);
    };

    const removeError = (indexTarget) => {
        setErrors(prevErrors => {
            // Make a copy of the previous array
            const newArr = [...prevErrors];

            // Remove one element starting from indexTarget
            newArr.splice(indexTarget, 1);

            return newArr;

        });
    };

    const addVariationTheme = async () => {
        try {
            await api.post("/variation-themes/", {
                name: name,
                filters: filters,
                categories: chosenCategories
            });
            navigate(-1);
        } catch (error) {
            let errorValues = Object.values(error.response.data.errors);

            setErrors(
                [
                    ...new Set(errorValues.map((arr) => {
                        return arr[0];
                    }))
                ]
            );
        }
    };


    return (
        <Box>
            {errors.length > 0 && (
                <Box>
                    {errors.map((error, index) => (
                        <Alert severity="error" key={index} sx={{ mb: 1 }} onClose={() => removeError(index)}>
                            {error}
                        </Alert>
                    ))}
                </Box>
            )}
            <Typography variant="h6" sx={{ mb: 1 }}>
                Variation theme name:
            </Typography>
            <Box>
                <TextField label="Name" value={name} onChange={(e) => setName(slugify(e.target.value))} />
            </Box>
            <Box>
                <Divider sx={{ mt: 2, backgroundColor: "black" }} />
                <Typography variant="h6">
                    Filters:
                </Typography>

                <Box>
                    <Box sx={{ px: 2, pb: 2 }}>
                        {filters.map((filter, indexFilterName) => (
                            <Fragment key={indexFilterName}>
                                <Box display={"flex"}>
                                    <Box sx={{ boxShadow: 2, padding: 3, mt: 2, backgroundColor: "#fcfcf0", borderRadius: "20px" }}>

                                        <Box sx={{ mt: indexFilterName === 0 ? 1 : 2 }}>
                                            <TextField label={"Filter name"} value={filter.name} onChange={(e) => changeFilterName(e.target.value, indexFilterName)} />
                                        </Box>
                                        <Typography variant="subtitle2" sx={{ mt: 1, fontSize: 16, mb: 2 }}>
                                            Field codes:
                                        </Typography>
                                        {facets.length > 0 && (
                                            <MultipleSelect
                                                value={filter.field_codes}
                                                setValue={changeFieldCodes}
                                                objectKey={"code"}
                                                objectValue={"name"}
                                                menuItems={facets}
                                                label={"Field codes"}
                                                index={indexFilterName}
                                            />
                                        )}
                                    </Box>

                                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ ml: 6 }}>
                                        <IconButton onClick={() => removeFilter(indexFilterName)}>
                                            <RemoveIcon />
                                        </IconButton>
                                        <IconButton onClick={() => addFilter()}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Fragment>
                        ))}
                    </Box>

                </Box>
            </Box>
            <Divider sx={{ mt: 2, backgroundColor: "black" }} />
            <Typography sx={{ mt: 1 }} variant="h6">
                Categories:
            </Typography>
            <Box sx={{ mt: 1, mb: 2 }}>
                <MultipleSelect value={chosenCategories === "*" ? [] : chosenCategories} setValue={setChosenCategories}
                    objectKey={"_id"}
                    objectValue={"name"}
                    menuItems={categories}
                    label={"Categories"} />
            </Box>
            <Box sx={{ mb: 2 }}>
                <Button variant="contained" size="large" color="primary"
                    onClick={addVariationTheme}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    )
}