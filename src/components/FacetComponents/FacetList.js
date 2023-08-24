import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


export default function FacetList({ facets }) {

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} size="small" aria-label="Facet table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Id</StyledTableCell>
                        <StyledTableCell align="left">Code</StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Type</StyledTableCell>
                        <StyledTableCell align="center">Optional</StyledTableCell>
                        <StyledTableCell align="center">Show in filters</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {facets.map((facet) => (
                        <TableRow key={facet._id}>
                            <TableCell component="th" scope='row'>
                                <Link to={facet._id}>
                                    {facet._id}
                                </Link>
                            </TableCell>
                            <TableCell align='left'>{facet.code}</TableCell>
                            <TableCell align='center'>{facet.name}</TableCell>
                            <TableCell align='center'>{facet.type}</TableCell>
                            <TableCell align='center'>{facet.optional ? "Yes" : "No"}</TableCell>
                            <TableCell align='center'>{facet.show_in_filters ? "Yes" : "No"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}