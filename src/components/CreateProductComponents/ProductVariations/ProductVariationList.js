import {
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableCell,
    Paper,
    TableRow,
    TextField,
    Box,
    IconButton,
    Button,
    Typography,
    Checkbox
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useState } from "react";
import { ModifyMultipleNamesDialog } from "../ModifyNameDialog";


export default function ProductVariationList(props) {
    const [newProdValues, setNewProdValues] = useState({ name: null, price: null, discount_rate: null, tax_rate: null, stock: null }); // Used to set new values of product variation properties
    const [checked, setChecked] = useState([]); // An array with indexes of checked products
    const [openDialog, setOpenDialog] = useState(false);

    let variationLength = props.productVariations?.length;

    // Returns true if object has non-null values
    const hasNonNullValues = (obj) => {
        return Object.values(obj).some(value => value !== null);
    };

    // Add a product with the specified to the checked
    const handleCheck = (index) => {

        if (checked.includes(index)) {
            // if the checked array already includes the index
            setChecked((prevChecked) => prevChecked.filter((item) => item !== index)); // remove the index from the checked array using filter
        } else {
            // Otherwise
            setChecked((prevChecked) => (
                [
                    ...prevChecked,
                    index
                ]
            )); // add the index to the checked array using spread operator
        }
    };

    // Add all product indexes to the checked
    const handleCheckAll = () => {
        // define a function that handles the select all option
        if (checked.length === props.productVariations.length) {
            // if the checked array has the same length as the objects array
            setChecked([]); // clear the checked array
        } else {
            // Otherwise
            setChecked(props.productVariations.map((obj, i) => i)); // fill the checked array with all indexes
        }
    };

    // Changes the value of the specified property in the newProdValues
    const handleChangeNewProdValues = (keyName, value) => {

        if (value === "" || value === 0) {
            value = null;
        }

        setNewProdValues((prevValue) => (
            {
                ...prevValue,
                [keyName]: value
            }
        ));
    };

    // Changes the value of the specified properties in the product with the specified index
    const handleChangeProductVariations = (keyName, value, productIndex) => {
        props.setProductVariations((prevValues) => {
            return prevValues.map((prevValue, index) => {
                if (productIndex === index) {
                    return {
                        ...prevValue,
                        [keyName]: value
                    }
                }

                return prevValue
            });
        });
    };

    // Deletes checked products
    const deleteChecked = () => {
        props.setProductVariations((prevValues) => {
            let filteredPrevValues = prevValues.filter((prevValue, i) => !checked.includes(i));
            if (filteredPrevValues.length === 0) {
                props.setProductVariationFields({});
            }

            return filteredPrevValues;
        }); // Return a new array with the product variations whose indexes are not in checked
        setChecked([]); // Reset checked to the empty list
    };

    // Applies values of properties to the chosen products
    const applyProductProps = () => {
        // Create a copy of newProdValues object
        let copy = Object.assign({}, newProdValues);
        Object.keys(copy).forEach((key) => {
            // Loop through the keys of the copy object
            if (copy[key] === null) {
                // If the value of the key is null
                delete copy[key]; // Delete the property from the copy object
            }
        });
        props.setProductVariations((prevValues) => {
            return prevValues.map((prevValue, i) => {
                if (checked.includes(i)) {
                    return {
                        ...prevValue,
                        ...copy
                    };
                }

                return prevValue
            });
        });

        // Reset newProdValues
        setNewProdValues({
            name: null, price: null,
            discount_rate: null, tax_rate: null,
            stock: null
        });
    };

    console.log(props.productVariations);

    return (
        <Box sx={{ mb: 2 }}>
            {openDialog && (
                <ModifyMultipleNamesDialog 
                    open={openDialog} // boolean value that determines is modal window opened
                    setOpen={setOpenDialog} // react setState function to set is modal window opened
                    checkedProducts={checked} // array of the checked products
                    setProductVariations={props.setProductVariations} // react setState function to set productVariations
                    attrs={props.attrs.filter((attr) => !Object.keys(props.productVariationFields).includes(attr.code))} // array of the attributes
                    nameValue={newProdValues.name ? newProdValues.name : ""} // value of the name property of newProdValues obj
                    changeName={(newValue) => handleChangeNewProdValues("name", newValue)} // function to change a name property of the newProdValues obj
                    resetProductName={() => handleChangeNewProdValues("name", null)} // function to reset product name
                />
            )}
            {variationLength > 0 && (
                <>
                    <Box display={"flex"} sx={{ mb: 2 }} alignItems={"center"}>
                        <Button size="small" variant="contained"
                            disabled={!(hasNonNullValues(newProdValues) && checked.length > 0)}
                            onClick={applyProductProps}
                        >
                            Apply Changes
                        </Button>
                        <Button size="small" variant="contained" sx={{ ml: 1 }} disabled={checked.length < 1} onClick={deleteChecked}>
                            Delete selected
                        </Button>
                        <Button size="small" variant="contained" sx={{ ml: 1 }} disabled={checked.length < 1} onClick={() => setChecked([])}>
                            Unselect variations
                        </Button>
                        <Typography variant="body1" sx={{ ml: 1 }}>
                            {variationLength} {variationLength > 1 ? "Variations" : "Variation"}
                        </Typography>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    {Object.keys(props.productVariationFields).map((key, index) => (
                                        <TableCell align="center" key={index + "P"}>
                                            <b>{key}</b>
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">
                                        <b>Product Name</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>Price</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>Discount Rate</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>Tax Rate</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>Stock</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>SKU</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>External product id</b>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">
                                        <Checkbox checked={checked.length === props.productVariations.length} onChange={handleCheckAll} />
                                    </TableCell>
                                    {Object.keys(props.productVariationFields).map((key, index) => (
                                        <TableCell align="center" key={index} sx={{ minWidth: 45 }}>

                                        </TableCell>
                                    ))}
                                    <TableCell align="center">
                                        <Box display={"flex"}>
                                            <TextField
                                                value={newProdValues.name ? newProdValues.name : ""}
                                                onChange={(e) => handleChangeNewProdValues(e.target.name, e.target.value)}
                                                sx={{ minWidth: 350 }}
                                                size="small"
                                                label={"Product name"} name={"name"}
                                            />
                                            <IconButton size="small" sx={{ ml: 1, px: 1 }} onClick={() => setOpenDialog(!openDialog)}>
                                                <AutoFixHighIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <NumericFormat
                                            value={newProdValues.price ? newProdValues.price : 0}
                                            onChange={(e) => handleChangeNewProdValues(e.target.name, Number(e.target.value))}
                                            decimalScale={2}
                                            decimalSeparator="."
                                            allowNegative={false}
                                            // Use customInput prop to pass TextField component
                                            customInput={TextField}
                                            sx={{ minWidth: 100 }}
                                            size="small"
                                            label={"Price"}
                                            name={"price"}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <NumericFormat
                                            value={newProdValues.discount_rate ? newProdValues.discount_rate : 0}
                                            onChange={(e) => handleChangeNewProdValues(e.target.name, Number(e.target.value))}
                                            decimalScale={2}
                                            decimalSeparator="."
                                            // Use customInput prop to pass TextField component
                                            customInput={TextField}
                                            sx={{ minWidth: 100 }}
                                            size="small"
                                            label={"Discount rate"}
                                            name={"discount_rate"}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <NumericFormat
                                            value={newProdValues.tax_rate ? newProdValues.tax_rate : 0}
                                            onChange={(e) => handleChangeNewProdValues(e.target.name, Number(e.target.value))}
                                            decimalScale={2}
                                            decimalSeparator="."
                                            // Use customInput prop to pass TextField component
                                            customInput={TextField}
                                            sx={{ minWidth: 100 }}
                                            size="small"
                                            label={"Tax rate"}
                                            name={"tax_rate"}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <NumericFormat
                                            value={newProdValues.stock ? newProdValues.stock : 0}
                                            onChange={(e) => handleChangeNewProdValues(e.target.name, Number(e.target.value))}
                                            decimalScale={0}
                                            // Use customInput prop to pass TextField component
                                            customInput={TextField}
                                            sx={{ minWidth: 75 }}
                                            size="small"
                                            label={"Stock"}
                                            name={"stock"} />
                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                </TableRow>
                                {props.productVariations.map((productVariation, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Checkbox checked={checked.includes(index)} onChange={() => handleCheck(index)} />
                                        </TableCell>
                                        {Object.keys(props.productVariationFields).map((key, index) => {
                                            let attr = productVariation.attrs.find(attr => attr.code === key);
                                            return (
                                                <TableCell align="center" key={index} sx={{ minWidth: 45 }}>
                                                    {attr.value} {attr.unit ? " " + attr.unit : ""}
                                                </TableCell>
                                            )
                                        })}
                                        <TableCell align="center">
                                            <Box>
                                                <TextField
                                                    value={productVariation.name ? productVariation.name : ""}
                                                    onChange={(e) => handleChangeProductVariations(e.target.name, e.target.value, index)}
                                                    sx={{ minWidth: 400 }}
                                                    size="small"
                                                    label={"Product name"} name={"name"}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <NumericFormat
                                                value={productVariation.price ? productVariation.price : 0}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, Number(e.target.value), index)}
                                                decimalScale={2}
                                                decimalSeparator="."
                                                allowNegative={false}
                                                // Use customInput prop to pass TextField component
                                                customInput={TextField}
                                                sx={{ minWidth: 100 }}
                                                size="small"
                                                label={"Price"}
                                                name={"price"}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <NumericFormat
                                                value={productVariation.discount_rate ? productVariation.discount_rate : 0}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, Number(e.target.value), index)}
                                                decimalScale={2}
                                                decimalSeparator="."
                                                // Use customInput prop to pass TextField component
                                                customInput={TextField}
                                                sx={{ minWidth: 100 }}
                                                size="small"
                                                label={"Discount rate"}
                                                name={"discount_rate"}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <NumericFormat
                                                value={productVariation.tax_rate ? productVariation.tax_rate : 0}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, Number(e.target.value), index)}
                                                decimalScale={2}
                                                decimalSeparator="."
                                                // Use customInput prop to pass TextField component
                                                customInput={TextField}
                                                sx={{ minWidth: 100 }}
                                                size="small"
                                                label={"Tax rate"}
                                                name={"tax_rate"}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <NumericFormat
                                                value={productVariation.stock ? productVariation.stock : 0}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, Number(e.target.value), index)}
                                                decimalScale={0}
                                                // Use customInput prop to pass TextField component
                                                customInput={TextField}
                                                sx={{ minWidth: 75 }}
                                                size="small"
                                                label={"Stock"}
                                                name={"stock"} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                value={productVariation.sku ? productVariation.sku : ""}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, e.target.value, index)}
                                                sx={{ minWidth: 125 }}
                                                size="small"
                                                label={"SKU"}
                                                name={"sku"} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                value={productVariation.external_id ? productVariation.external_id : ""}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, e.target.value, index)}
                                                sx={{ minWidth: 175 }}
                                                size="small"
                                                label={"External product id"}
                                                name={"external_id"} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer >
                </>
            )

            }
        </Box>
    )
}
