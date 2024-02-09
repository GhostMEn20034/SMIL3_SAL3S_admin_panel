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
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export default function EventList({ events }) {

    dayjs.extend(utc);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} size="small" aria-label="Facet table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Id</StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Start Date</StyledTableCell>
                        <StyledTableCell align="center">End Date</StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event) => (
                        <TableRow key={event._id}>
                            <TableCell component="th" scope='row'>
                                <Link to={event._id}>
                                    {event._id}
                                </Link>
                            </TableCell>
                            <TableCell align='center'>{event.name}</TableCell>
                            <TableCell align='center'>{dayjs(event.start_date).format("dddd, MMMM D, YYYY HH:mm")}</TableCell>
                            <TableCell align='center'>{dayjs(event.end_date).format("dddd, MMMM D, YYYY HH:mm")}</TableCell>
                            <TableCell align='center'>{event.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}