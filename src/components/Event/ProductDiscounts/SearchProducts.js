import { Fragment } from "react";
import {
    Box, Stack, TextField, Table, TableHead, TableRow,
    TableContainer, TableBody, Paper, Checkbox, Button, Pagination
} from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from '@mui/material/styles';

import MultipleSelect from '../../MultipleSelectValue';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export default function SearchProducts(props) {


    return (
        <Box>
            <Box sx={{ml: 1}}>
                <Stack sx={{ mb: 2 }}>
                    <TextField size="small" label="SKU" value={props.sku}
                        onChange={(e) => props.setSku(e.target.value)} sx={{ maxWidth: 300 }} />
                </Stack>
                <Stack sx={{ mb: 2 }}>
                    <MultipleSelect label="Categories"
                        value={props.categories}
                        setValue={props.setCategories}
                        menuItems={props.categoryChoices} 
                        objectKey={"_id"}
                        objectValue={"name"}
                        />
                </Stack>
                <Stack spacing={2} sx={{ width: 525 }} direction="row">
                    <Autocomplete
                        sx={{ minWidth: 475 }}
                        size="small"
                        freeSolo
                        id="free-solo-2-demo"
                        disableClearable
                        inputValue={props.productName}
                        onInputChange={(_, newInputValue) => {
                            props.setProductName(newInputValue);
                        }}
                        options={[].map((option) => option)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search a product"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                            />
                        )}
                    />
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={props.applyFilters}
                        sx={{ maxWidth: 50 }}
                    >
                        Search
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 2, width: 1250}}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 850 }} size="small" aria-label="Facet table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center"></StyledTableCell>
                                <StyledTableCell align="center" sx={{ width: '50%' }}>Name</StyledTableCell>
                                <StyledTableCell align="center">Price</StyledTableCell>
                                <StyledTableCell align="center" sx={{ width: '17%' }}>Discount Rate</StyledTableCell>
                                <StyledTableCell align="center">SKU</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.searchResults.map((product, index) => (
                                <Fragment key={index}>
                                    <TableRow key={product._id}>
                                        <TableCell sx={{ backgroundColor: "#edf4ff" }} align='center'>
                                            <Checkbox
                                                checked={props.discountedProducts
                                                    .some(discountedProduct => discountedProduct._id === product._id)}
                                                onChange={() => props.handleChangeChecked(product)}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#edf4ff", width: '50%' }} component="th" scope='row'>
                                            {product.name}
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#edf4ff" }} align='center'>{product.price}</TableCell>
                                        <TableCell sx={{ backgroundColor: "#edf4ff", width: '17%' }} align='center'>
                                            {product.discount_rate ? product.discount_rate : "No discount"}
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#edf4ff" }} align='center'>{product.sku}</TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ my: 2 }}>
                <Pagination count={props.pageCount} page={props.page} onChange={props.handlePageChange} color="primary" />
            </Box>
        </Box>
    )
}