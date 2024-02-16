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


export default function DealList({ deals }) {

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} size="small" aria-label="Facet table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Id</StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Is Parent</StyledTableCell>
                        <StyledTableCell align="center">Parent Name</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deals.map((deal) => (
                        <TableRow key={deal._id}>
                            <TableCell component="th" scope='row'>
                                <Link to={deal._id}>
                                    {deal._id}
                                </Link>
                            </TableCell>
                            <TableCell align='center'>{deal.name}</TableCell>
                            <TableCell align='center'>{deal.is_parent ? "Yes" : "No"}</TableCell>
                            <TableCell align='center'>{deal.parent_name ? deal.parent_name : "No parent"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}