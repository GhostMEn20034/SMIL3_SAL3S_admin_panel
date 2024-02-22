import { Box, TextField } from "@mui/material";
import ControlledDateTimePicker from "../ControlledDateTimePicker";
import dayjs from "dayjs";

export default function UpdateSearchTerms(props) {

    return (
        <Box>
            <Box>
                <TextField
                    value={props.name ? props.name : ""}
                    onChange={(e) => props.setName(e.target.value.toLowerCase())}
                    label={"Name"}
                    size="small"
                    error={props.errorHandler.isValueExist("name")}
                    helperText={props.errorHandler.getObjectValue("name")}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField value={props.searchCount ? props.searchCount : 0} size="small" label="Search count" disabled/>
            </Box>
            <Box sx={{ mt: 2 }}>
                <ControlledDateTimePicker
                    value={props.lastSearched ? props.lastSearched : dayjs()}
                    label="Last Searched"
                    disabled={true}
                    showHours={true}
                    showMinutes={true}
                />
            </Box>

        </Box>
    );
}