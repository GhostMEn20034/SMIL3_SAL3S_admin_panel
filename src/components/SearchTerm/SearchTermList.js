import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
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

export default function SearchTermsList({ searchTerms, checked, handleCheck, checkAll }) {

    dayjs.extend(utc);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} size="small" aria-label="Facet table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>
                            <Checkbox size='small' sx={{color: "white"}}
                            checked={checked.length === searchTerms.length}
                            onChange={checkAll}
                            />
                        </StyledTableCell>
                        <StyledTableCell>Id</StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Search Count</StyledTableCell>
                        <StyledTableCell align="center">Last Searched</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {searchTerms.map((searchTerm) => (
                        <TableRow key={searchTerm._id}>
                            <TableCell align='center' width={"5%"}>
                                <Checkbox size='small'
                                    checked={checked.includes(searchTerm._id)}
                                    onChange={() => handleCheck(searchTerm._id)}
                                />
                            </TableCell>
                            <TableCell component="th" scope='row'>
                                <Link to={searchTerm._id}>
                                    {searchTerm._id}
                                </Link>
                            </TableCell>
                            <TableCell align='center'>{searchTerm.name}</TableCell>
                            <TableCell align='center'>{searchTerm.search_count}</TableCell>
                            <TableCell align='center'>{dayjs(searchTerm.last_searched).format("dddd, MMMM D, YYYY HH:mm")}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}