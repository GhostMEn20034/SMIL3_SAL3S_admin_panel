import { Box, TextField, Button, Paper, Alert } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Textarea from "../TextArea";
import ControlledDateTimePicker from "../ControlledDateTimePicker";
import { VisuallyHiddenInput } from "../HiddenInput";


export default function EventFields(props) {

    const getImageFromUrl = (image) => {
        if (image instanceof File) {
            return image?.url;
        }
        return image;
    };

    return (
        <Box>
            <Box>
                <TextField label="Event Name"
                    value={props.name}
                    onChange={(e) => props.setName(e.target.value)}
                    size="small"
                    error={props.errorHandler.isValueExist("name")}
                    helperText={props.errorHandler.getObjectValue("name")}
                />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Textarea value={props.description}
                    setValue={props.setDescription}
                    minRows={3}
                    placeholder={"Enter a Description (OPTIONAL) ..."}
                    sx={{ width: 400 }}
                    error={props.errorHandler.isValueExist("description")}
                    helperText={props.errorHandler.getObjectValue("description")}
                />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Box>
                    {props.errorHandler.isValueExist("image") && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {props.errorHandler.getObjectValue("image")}
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
            <Box sx={{ mt: 3 }}>
                {props.errorHandler.isValueExist("start_date") && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {props.errorHandler.getObjectValue("start_date")}
                    </Alert>
                )}
                <ControlledDateTimePicker label={"Start Date (UTC)"}
                    value={props.startDate}
                    setValue={props.setStartDate}
                    showHours={true}
                    showMinutes={true}
                />
            </Box>
            <Box sx={{ mt: 3 }}>
                {props.errorHandler.isValueExist("end_date") && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {props.errorHandler.getObjectValue("end_date")}
                    </Alert>
                )}
                <ControlledDateTimePicker label={"Start Date (UTC)"}
                    value={props.endDate}
                    setValue={props.setEndDate}
                    showHours={true}
                    showMinutes={true}
                />
            </Box>
        </Box>
    );
}
