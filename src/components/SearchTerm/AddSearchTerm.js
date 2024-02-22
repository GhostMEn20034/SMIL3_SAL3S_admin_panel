import { Box, TextField } from '@mui/material';

export default function AddSearchTerm(props) {

  return (
    <Box>
      <Box>
        <TextField
          value={props.name} 
          onChange={(e) => props.setName(e.target.value.toLowerCase())} 
          label={"Name"} 
          size="small" 
          error={props.errorHandler.isValueExist("name")}
          helperText={props.errorHandler.getObjectValue("name")}
          />
      </Box>
    </Box>
  );
}