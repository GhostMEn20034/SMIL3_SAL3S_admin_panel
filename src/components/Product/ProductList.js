import { Fragment, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import { IconButton } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export default function ProductList(props) {
    const [open, setOpen] = useState(null); // Index of the opened collapse element

    // Sets a collapse element as opened. 
    // Requires an index of product where collapse should be opened
    const handleClick = (index) => {
        setOpen((prevValue) => {
            if (prevValue === index) {
                return null;
            }

            return index
        });
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} size="small" aria-label="Facet table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Price</StyledTableCell>
                        <StyledTableCell align="center">Tax for each product sold</StyledTableCell>
                        <StyledTableCell align="center">Is for sale</StyledTableCell>
                        <StyledTableCell align="center">Parent</StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.products.map((product, index) => (
                        <Fragment key={product._id}>
                            <TableRow key={product._id}>
                                <TableCell sx={{backgroundColor: "#edf4ff"}} align='center' width={"5%"}>
                                    <Checkbox
                                        checked={props.checked[index].checked === true}
                                        onChange={() => props.handleChangeChecked(index)}
                                    />
                                </TableCell>
                                <TableCell sx={{backgroundColor: "#edf4ff"}} component="th" scope='row' width={"40%"}>
                                    <Link to={`${product._id}/edit`}>
                                        {product.name}
                                    </Link>
                                </TableCell>
                                <TableCell sx={{backgroundColor: "#edf4ff"}} align='center' width={"12%"}>{product.price}</TableCell>
                                <TableCell sx={{backgroundColor: "#edf4ff"}} align='center' width={"12%"}>{product.tax}</TableCell>
                                <TableCell sx={{backgroundColor: "#edf4ff"}} align='center' width={"10%"}>{product.for_sale ? "Yes" : "No"}</TableCell>
                                <TableCell align='center' sx={{ minWidth: "20px", backgroundColor: "#edf4ff" }}>{product.parent ? "Yes" : "No"}</TableCell>
                                <TableCell sx={{backgroundColor: "#edf4ff"}} align='center' width={"5%"}>
                                    <IconButton size='small'
                                        onClick={() => handleClick(index)}
                                        disabled={!product.variations?.length > 0}
                                    >
                                        {open === index ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ px: 0 }}>
                                <TableCell colSpan={7} sx={{ padding: 0, border: 0 }}>
                                    <Collapse in={open === index} timeout="auto" unmountOnExit>
                                        {product.variations.map((variation, variationIndex) => (
                                            <TableRow key={variation._id}>
                                                <TableCell align='center' width={"5%"}>
                                                    <Checkbox
                                                        checked={props.checked[index].variations[variationIndex].checked === true}
                                                        onChange={() => props.handleChangeChecked(index, variationIndex)}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" scope='row' width={"40%"}>
                                                    <Link to={`${variation._id}/edit`}>
                                                        {variation.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align='center' width={"12%"}>{variation.price}</TableCell>
                                                <TableCell align='center' width={"12%"}>{variation.tax}</TableCell>
                                                <TableCell align='center' width={"10%"}>{variation.for_sale ? "Yes" : "No"}</TableCell>
                                                <TableCell align='center'>{variation.parent ? "Yes" : "No"}</TableCell>
                                                <TableCell align='center' width={"5.5%"}></TableCell>
                                            </TableRow>
                                        ))}

                                    </Collapse>
                                </TableCell>

                            </TableRow>
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};