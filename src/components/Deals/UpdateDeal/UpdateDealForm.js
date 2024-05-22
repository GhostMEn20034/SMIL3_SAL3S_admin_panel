import { Box, TextField, Paper, Button, Alert } from "@mui/material";
import { NumericFormat } from "react-number-format";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { VisuallyHiddenInput } from "../../HiddenInput";
import SelectValueRadioGroup from "../../SelectValueRadioGroup";
import SelectValue from "../../SelectValue";
import Textarea from "../../TextArea";

export default function UpdateDealForm(props) {
    const getImageFromUrl = (image) => {
        if (image instanceof File) {
            return image?.url;
        }
        return image;
    };

    return (
        <Box>
            <Box>
                <TextField
                    size="small"
                    label="Deal Name"
                    value={props.dealData?.name ? props.dealData?.name : ""}
                    onChange={(e) => props.handleChangeDealData(e.target.name, e.target.value)}
                    name="name"
                    error={props.errorHandler.isValueExist("name")}
                    helperText={props.errorHandler.getObjectValue("name")}
                />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Box>
                    {props.errorHandler.isValueExist("image") && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {props.errorHandler.getObjectValue("image").join(", ")}
                        </Alert>
                    )}
                    <Paper elevation={3} sx={{ height: "120px", minWidth: "167px", maxHeight: "140px" }}>
                        {props.image && (
                            <img src={getImageFromUrl(props.image)} alt={"Img"}
                                style={{ width: "100%", maxHeight: "120px", objectFit: "scale-down" }} />
                        )}
                    </Paper>
                    <Button component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mt: 1 }}
                        onChange={(e) => props.setImage(e)}
                    >
                        Upload Image
                        <VisuallyHiddenInput type="file" accept="image/jpeg" />
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
                <SelectValueRadioGroup label={"Is It Visible For Other people?"} value={props.dealData?.is_visible} setValue={(value) => props.handleChangeDealData("is_visible", Boolean(value))} menuItems={[
                    { name: "No", value: false },
                    { name: "Yes", value: true }
                ]} valueType={"boolean"} />
            </Box>
            <Box sx={{ mt: 2 }}>
                <SelectValueRadioGroup label={"Is It Parent Deal?"} value={props.isParent} setValue={props.setIsParent} menuItems={[
                    { name: "No", value: false },
                    { name: "Yes", value: true }
                ]} valueType={"boolean"} disabledIndexes={[0, 1]} />
            </Box>
            {!props.isParent && (
                <>
                    <Box sx={{ mt: 2 }}>
                        <SelectValue
                            label="Parent Deal"
                            value={props.dealData?.parent_id ? props.dealData.parent_id : ""}
                            setValue={(value) => props.handleChangeDealData("parent_id", value)}
                            objectKey={"_id"}
                            menuItems={[
                                { "_id": null, "name": "No Parent" },
                                ...(props.parentDeals ? props.parentDeals : []),
                            ]}
                            otherProps={{ width: 223 }}
                            errors={{
                                error: props.errorHandler.isValueExist("parent_id"),
                                helperText: props.errorHandler.getObjectValue("parent_id"),
                            }}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <SelectValue
                            label="Category"
                            value={props.dealData?.category_id ? props.dealData.category_id : ""}
                            setValue={(value) => props.handleChangeDealData("category_id", value)}
                            objectKey={"_id"}
                            menuItems={[
                                { "_id": null, "name": "No Category" },
                                ...(props.categoryChoices ? props.categoryChoices : []),
                            ]}
                            otherProps={{ width: 223 }}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            size="small"
                            label="Query"
                            value={props.dealData?.query ? props.dealData?.query : ""}
                            onChange={(e) => props.handleChangeDealData(e.target.name, e.target.value)}
                            name="query"
                            error={props.errorHandler.isValueExist("query")}
                            helperText={props.errorHandler.getObjectValue("query")}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <NumericFormat
                            value={props.dealData?.price_min ? props.dealData?.price_min : 0}
                            onChange={(e) => props.handleChangeDealData(e.target.name, Number(e.target.value))}
                            decimalScale={2}
                            decimalSeparator="."
                            // Use customInput prop to pass TextField component
                            customInput={TextField}
                            // error={props.errorHandler.isValueExist("discounted_products", index, "discount_rate")}
                            // helperText={props.errorHandler.getObjectValue("discounted_products", index, "discount_rate")}
                            sx={{ minWidth: 100 }}
                            size="small"
                            label={"Minimal Price"}
                            name={"price_min"}
                            error={props.errorHandler.isValueExist("price_min")}
                            helperText={props.errorHandler.getObjectValue("price_min")}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <NumericFormat
                            value={props.dealData?.price_max ? props.dealData?.price_max : 0}
                            onChange={(e) => props.handleChangeDealData(e.target.name, Number(e.target.value))}
                            decimalScale={2}
                            decimalSeparator="."
                            // Use customInput prop to pass TextField component
                            customInput={TextField}
                            // error={props.errorHandler.isValueExist("discounted_products", index, "discount_rate")}
                            // helperText={props.errorHandler.getObjectValue("discounted_products", index, "discount_rate")}
                            sx={{ minWidth: 100 }}
                            size="small"
                            label={"Maximum Price"}
                            name={"price_max"}
                            error={props.errorHandler.isValueExist("price_max")}
                            helperText={props.errorHandler.getObjectValue("price_max")}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            size="small"
                            disabled={true}
                            value={decodeURIComponent(props.dealData?.query_string)}
                            label="Pre calculated query string"
                            sx={{ minWidth: 300 }}
                        />
                    </Box>
                </>
            )}
            <Box sx={{ mt: 2 }}>
                <Textarea
                    value={props.description ? props.description : ""}
                    setValue={props.setDescription}
                    placeholder="Add a deal's description... (Optional)"
                    sx={{ width: 450 }}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField
                    size="small"
                    label="Button text"
                    value={props.dealData?.button_text ? props.dealData?.button_text : ""}
                    onChange={(e) => props.handleChangeDealData(e.target.name, e.target.value)}
                    name="button_text"
                    error={props.errorHandler.isValueExist("button_text")}
                    helperText={props.errorHandler.getObjectValue("button_text")}
                />
            </Box>
        </Box>
    );
}