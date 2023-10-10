import { Box, Chip } from "@mui/material";
import { styled } from '@mui/material/styles';


const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));
  

export default function ProductVariationChips(props) {
    // returns Chips array of product attrs

    // console.log(props.attrs);

    return (
        <Box component="ul"
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0
            }}
        >
            {props.attrs.map((attr, index) => (
                <ListItem key={index} sx={{maxWidth: 120}}>
                    <Chip 
                    label={`${attr.value}` + (attr.unit ? " " + attr.unit : "")}
                    onDelete={() => props.delProductVariationField(index)}
                    />
                </ListItem>
            ))}
        </Box>
    );
};