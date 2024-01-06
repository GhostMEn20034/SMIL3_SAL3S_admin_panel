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
import { Link } from 'react-router-dom';
import { ModifyMultipleNamesDialog } from "../ModifyNameDialog";

export default function ProductVariationList(props) {
    /**
     * productVariationFields - Values of product fields that included to variation theme
     * setProductVariationFields - set function for productVariationFields
     * productVariationFields - Values of product fields that included to variation theme
     * setProductVariationFields - set function for productVariationFields
     * variationFields - Field codes of the attributes from the variation theme
     * editMode - Boolean. Is this component used for updating products.
     * attrs={attrs} - Attributes from the parent product
     * callbackOnDelete - (OPTIONAL) Function that need to be executed on removal of product variations
     * keysForCallback - (OPTIONAL) keys which will be used for getting value from each object, suppose keyForCallback = ["id","name"],
     * then list of  objects with "name" and "id" properties will be passed to the callback function. If keyForCallback is undefined, then the list of whole objects
     * will passed to the callback function.
     */

    const [newProdValues, setNewProdValues] = useState({ name: null, price: null, discount_rate: null, tax_rate: null, stock: null }); // Used to set new values of product variation properties
    const [checked, setChecked] = useState([]); // An array with indexes of checked products
    const [openDialog, setOpenDialog] = useState(false);

    let variationLength = props.productVariations?.length;

    let variationsInitialLength = props.variationsInitialLength ? props.variationsInitialLength : 0;

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

            if (keyName === "discount_rate" && value === 0) {
                value = null;
            }

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
            let deletedProducts = [];

            let filteredPrevValues = prevValues.filter((product, i) => {
                // if product is not in checked array, then product is remains in productVariations array
                if (!checked.includes(i)) {
                    return true
                }
                // Otherwise, push product object to the array of products 
                // to delete and remove product from the product variations array.
                deletedProducts.push(product)
                return false
            });

            // Execute callback function's code if callbackOnDelete property is function
            if (props.callbackOnDelete instanceof Function) {
                let callbackArg;
                // if there are keys that should be passed into the each object
                if (props.keysForCallback?.length > 0) {
                    // then return an array of objects with the specified properties.
                    callbackArg = deletedProducts.map((deletedProduct) => {
                        // Create a new object to store the desired fields
                        let objToReturn = {};

                        // Iterate through the specified keys
                        for (const key of props.keysForCallback) {
                            // Check if the key exists in the original object
                            if (key in deletedProduct) {
                                // Add the key-value pair to the new object
                                objToReturn[key] = deletedProduct[key];
                            }
                        }
                        return objToReturn;
                    });
                } else {
                    // Otherwise, use an array of the whole objects as callback argument
                    callbackArg = deletedProducts;
                }
                // execute function's code with callback argument
                props.callbackOnDelete(callbackArg);
            }

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

    const getErrors = (isNewVariation, ...path) => {
        if (props.editMode) {
            return props?.getVariationErrors(isNewVariation, ...path);
        }

        return props.errorHandler?.getObjectValue("variations", ...path);
    };

    const findErrors = (isNewVariation, ...path) => {
        if (props.editMode) {
            return props?.isVariationErrorExists(isNewVariation, ...path);
        }

        return props.errorHandler?.isValueExist("variations", ...path);
    };

    

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
                    variationAttrs={props.variationFields ? props.variationFields : Object.keys(props.productVariationFields)} // Product variation attributes
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
                                    {props.editMode && (
                                        <TableCell>

                                        </TableCell>
                                    )}
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
                                        <b>Max order quantity</b>
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
                                    {props.editMode && (
                                        <TableCell>

                                        </TableCell>
                                    )}
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
                                    <TableCell align="center">
                                        <NumericFormat
                                            value={newProdValues.max_order_qty ? newProdValues.max_order_qty : 0}
                                            onChange={(e) => handleChangeNewProdValues(e.target.name, Number(e.target.value))}
                                            decimalScale={0}
                                            // Use customInput prop to pass TextField component
                                            customInput={TextField}
                                            sx={{ minWidth: 75 }}
                                            size="small"
                                            label={"Max order quantity"}
                                            name={"max_order_qty"} />
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
                                        {props.editMode && (
                                            <TableCell>
                                                <Button
                                                    component={Link}
                                                    to={`/products/${productVariation._id}/edit`}
                                                    variant="text"
                                                    color="primary"
                                                    size="small"
                                                    disabled={!productVariation._id}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        )}
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
                                                    error={findErrors(
                                                        !productVariation._id ? true : false, 
                                                        index - (!productVariation._id ? variationsInitialLength : 0), "name"
                                                        )}
                                                    helperText={getErrors(
                                                        !productVariation._id ? true : false, 
                                                        index - (!productVariation._id ? variationsInitialLength : 0), "name"
                                                        )}
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
                                                error={findErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "price"
                                                    )}
                                                helperText={getErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "price"
                                                    )}
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
                                                error={findErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "discount_rate"
                                                    )}
                                                helperText={getErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "discount_rate"
                                                    )}
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
                                                error={findErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "tax_rate"
                                                    )}
                                                helperText={getErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "tax_rate"
                                                    )}
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
                                                name={"stock"}
                                                error={findErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength  : 0), "stock"
                                                    )}
                                                helperText={getErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength  : 0), "stock"
                                                    )}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <NumericFormat
                                                value={productVariation.max_order_qty ? productVariation.max_order_qty : 0}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, Number(e.target.value), index)}
                                                decimalScale={0}
                                                // Use customInput prop to pass TextField component
                                                customInput={TextField}
                                                sx={{ minWidth: 75 }}
                                                size="small"
                                                label={"Max order quantity"}
                                                name={"max_order_qty"}
                                                error={findErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength  : 0), "max_order_qty"
                                                    )}
                                                helperText={getErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength  : 0), "max_order_qty"
                                                    )}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                value={productVariation.sku ? productVariation.sku : ""}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, e.target.value, index)}
                                                sx={{ minWidth: 125 }}
                                                size="small"
                                                label={"SKU"}
                                                name={"sku"}
                                                error={findErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "sku"
                                                    )}
                                                helperText={getErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "sku"
                                                    )}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                value={productVariation.external_id ? productVariation.external_id : ""}
                                                onChange={(e) => handleChangeProductVariations(e.target.name, e.target.value, index)}
                                                sx={{ minWidth: 175 }}
                                                size="small"
                                                label={"External product id"}
                                                name={"external_id"}
                                                error={findErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "external_id"
                                                    )}
                                                helperText={getErrors(
                                                    !productVariation._id ? true : false, 
                                                    index - (!productVariation._id ? variationsInitialLength : 0), "external_id"
                                                    )}
                                            />
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
