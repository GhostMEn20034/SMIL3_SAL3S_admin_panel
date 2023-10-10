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
import { Fragment } from "react";


export default function ProductVariationList(props) {

    let variationLength = props.productVariations?.length;

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

    return (
        <Box sx={{ mb: 2 }}>
            {variationLength > 0 && (
                <>
                    <Box display={"flex"} sx={{ mb: 2 }} alignItems={"center"}>
                        <Button size="small" variant="contained">
                            Apply Changes
                        </Button>
                        <Button size="small" variant="contained" sx={{ ml: 1 }}>
                            Delete selected
                        </Button>
                        <Button size="small" variant="contained" sx={{ ml: 1 }}>
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
                                {props.productVariations.map((productVariation, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Checkbox />
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
                                                <Box display={"flex"}>
                                                    <TextField
                                                        value={productVariation.name}
                                                        onChange={(e) => handleChangeProductVariations(e.target.name, e.target.value, index)}
                                                        sx={{ minWidth: 200 }}
                                                        size="small"
                                                        label={"Product name"} name={"name"}
                                                    />
                                                    <IconButton size="small" sx={{ ml: 1, px: 1 }}>
                                                        <AutoFixHighIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <NumericFormat
                                                    value={productVariation.price}
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
                                                    value={productVariation.discount_rate}
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
                                                    value={productVariation.tax_rate}
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
                                                    value={productVariation.stock}
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
                                                    value={productVariation.sku}
                                                    onChange={(e) => handleChangeProductVariations(e.target.name, e.target.value, index)}
                                                    sx={{ minWidth: 125 }}
                                                    size="small"
                                                    label={"SKU"}
                                                    name={"sku"} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    value={productVariation.external_id}
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
