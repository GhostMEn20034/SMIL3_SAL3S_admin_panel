import {
    Box, TextField, Button, TableContainer, Paper, Checkbox,
    Table, TableHead, TableRow, TableCell, TableBody, Typography
} from "@mui/material";
import { useState } from "react";
import { NumericFormat } from "react-number-format";

export default function SetProductDiscounts(props) {

    const [checked, setChecked] = useState([]);
    const [temporaryDiscountRate, setTemporaryDiscountRate] = useState(null);

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

    const handleChangeTemporaryDiscountRate = (value) => {
        if (!value) {
            value = null;
        }
        setTemporaryDiscountRate(value);
    };

    const handleChangeDiscountedProduct = (fieldName, newValue, index) => {
        if (fieldName === 'discount_rate' && !newValue) {
            newValue = null;
        }

        props.setDiscountedProducts((prevValues) => {
            return prevValues.map((product, i) => {
                if (index === i) {
                    return { ...product, [fieldName]: newValue };
                }

                return product;
            })
        });
    };

    const removeProductFromList = () => {
        if (checked.length > 0) {
            let redundantChecked = [];
            props.setDiscountedProducts((prevValues) => {
                return prevValues.filter((_, i) => {
                    if (!checked.includes(i)) {
                        return true;
                    }
                    redundantChecked.push(i)
                    return false;
                });
            });
            setChecked((prevChecked) => {
                return prevChecked.filter(value => !redundantChecked.includes(value));
            });
        }
    };

    // Add all product indexes to the checked
    const handleCheckAll = () => {
        // define a function that handles the select all option
        if (checked.length === props.discountedProducts.length) {
            // if the checked array has the same length as the objects array
            setChecked([]); // clear the checked array
        } else {
            // Otherwise
            setChecked(props.discountedProducts.map((_, i) => i)); // fill the checked array with all indexes
        }
    };

    const applyChangesToChecked = () => {
        if (checked.length > 0) {
            props.setDiscountedProducts((prevValues) => {
                return prevValues.map((product, i) => {
                    if (checked.includes(i)) {
                        return { ...product, discount_rate: temporaryDiscountRate };
                    }
                    return product;
                });
            });
            setTemporaryDiscountRate(null);
        }
    };

    return (
        <Box>
            <Box display={"flex"} sx={{ mb: 2 }} alignItems={"center"}>
                <Button
                    size="small"
                    variant="contained"
                    disabled={!temporaryDiscountRate || checked.length < 1}
                    onClick={applyChangesToChecked}
                >
                    Apply Changes
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    disabled={checked.length < 1}
                    onClick={removeProductFromList}
                    sx={{ ml: 1 }}
                >
                    Remove From The List
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    disabled={checked.length < 1}
                    sx={{ ml: 1 }}
                    onClick={() => setChecked([])}
                >
                    Unselect products
                </Button>
                <Typography variant="body1" sx={{ ml: 1 }}>
                    {props.discountedProducts.length} Product(s)
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>

                            </TableCell>
                            <TableCell align="center">
                                <b>Product ID</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Product Name</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Discount Rate</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">
                                <Checkbox
                                    checked={
                                        checked.length === props.discountedProducts.length
                                        && props.discountedProducts.length >= 1
                                    }
                                    onChange={handleCheckAll}
                                />
                            </TableCell>
                            <TableCell align="center">

                            </TableCell>
                            <TableCell align="center">

                            </TableCell>
                            <TableCell align="center">
                                <NumericFormat
                                    value={!temporaryDiscountRate ? 0 : temporaryDiscountRate}
                                    onChange={(e) => handleChangeTemporaryDiscountRate(e.target.value)}
                                    decimalScale={2}
                                    decimalSeparator="."
                                    // Use customInput prop to pass TextField component
                                    customInput={TextField}
                                    sx={{ minWidth: 75 }}
                                    size="small"
                                    label={"Discount rate"}
                                    name={"discount_rate"} />
                            </TableCell>
                        </TableRow>
                        {props.discountedProducts.map((discountedProduct, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Checkbox checked={checked.includes(index)} onChange={() => handleCheck(index)} />
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body1">
                                        {discountedProduct._id}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        value={discountedProduct.name}
                                        disabled
                                        sx={{ minWidth: 600 }}
                                        size="small"
                                        label={"Product Name"}
                                        name={"name"}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <NumericFormat
                                        value={
                                            discountedProduct.discount_rate
                                                ? discountedProduct.discount_rate : 0
                                        }
                                        onChange={
                                            (e) => handleChangeDiscountedProduct(
                                                e.target.name, e.target.value, index
                                            )
                                        }
                                        decimalScale={2}
                                        decimalSeparator="."
                                        // Use customInput prop to pass TextField component
                                        customInput={TextField}
                                        error={props.errorHandler.isValueExist("discounted_products", index, "discount_rate")}
                                        helperText={props.errorHandler.getObjectValue("discounted_products", index, "discount_rate")}
                                        sx={{ minWidth: 100 }}
                                        size="small"
                                        label={"Discount rate"}
                                        name={"discount_rate"}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
        </Box>
    )
}