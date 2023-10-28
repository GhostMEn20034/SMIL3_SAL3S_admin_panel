import { TextField, Box, IconButton } from "@mui/material";
import { NumericFormat } from "react-number-format";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';


export default function BaseAttrsForm(props) {


    // A function changes values of the baseAttrs object
    const handleChange = (keyName, value) => {

        if (value === "" || value === 0) {
            value = null;
        }

        props.setBaseAttrs((prevValue) => (
            {
                ...prevValue,
                [keyName]: value
            }
        ));
    };


    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <TextField
                    value={props.baseAttrs.name ? props.baseAttrs.name : ""}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    sx={{ minWidth: 325 }}
                    size="small"
                    label={"Product name"} name={"name"}
                />
                <IconButton sx={{ ml: 1, padding: 1 }} onClick={() => props.setOpenDialog(!props.openDialog)}>
                    <AutoFixHighIcon fontSize="small"/>
                </IconButton>
            </Box>
            <Box sx={{ mb: 2 }}>
                <NumericFormat
                    value={props.baseAttrs.price ? props.baseAttrs.price : 0}
                    onChange={(e) => handleChange(e.target.name, Number(e.target.value))}
                    decimalScale={2}
                    decimalSeparator="."
                    allowNegative={false}
                    // Use customInput prop to pass TextField component
                    customInput={TextField}
                    sx={{ minWidth: 325 }}
                    size="small"
                    label={"Price"}
                    name={"price"}
                />
            </Box>
            <Box sx={{ mb: 2 }}>
                <NumericFormat
                    value={props.baseAttrs.discount_rate ? props.baseAttrs.discount_rate : 0}
                    onChange={(e) => handleChange(e.target.name, Number(e.target.value))}
                    decimalScale={2}
                    decimalSeparator="."
                    // Use customInput prop to pass TextField component
                    customInput={TextField}
                    sx={{ minWidth: 325 }}
                    size="small"
                    label={"Discount rate"}
                    name={"discount_rate"}
                />
            </Box>
            <Box sx={{ mb: 2 }}>
                <NumericFormat
                    value={props.baseAttrs.tax_rate ? props.baseAttrs.tax_rate : 0}
                    onChange={(e) => handleChange(e.target.name, Number(e.target.value))}
                    decimalScale={2}
                    decimalSeparator="."
                    // Use customInput prop to pass TextField component
                    customInput={TextField}
                    sx={{ minWidth: 325 }}
                    size="small"
                    label={"Tax rate"}
                    name={"tax_rate"}
                />
            </Box>
            <Box sx={{ mb: 2 }}>
                <NumericFormat
                    value={props.baseAttrs.stock ? props.baseAttrs.stock : 0}
                    onChange={(e) => handleChange(e.target.name, Number(e.target.value))}
                    decimalScale={0}
                    // Use customInput prop to pass TextField component
                    customInput={TextField}
                    sx={{ minWidth: 325 }}
                    size="small"
                    label={"Stock"}
                    name={"stock"} />
            </Box>
            <Box sx={{ mb: 2 }}>
                <TextField
                    value={props.baseAttrs.sku ? props.baseAttrs.sku : ""}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    sx={{ minWidth: 325 }}
                    size="small"
                    label={"SKU"}
                    name={"sku"} />
            </Box>
            <Box>
                <TextField
                    value={props.baseAttrs.external_id ? props.baseAttrs.external_id : ""}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    sx={{ minWidth: 325 }}
                    size="small"
                    label={"External product id"}
                    name={"external_id"} />
            </Box>
        </Box>
    )
}