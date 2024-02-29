import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
// import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { useFetchUserKyc } from '../../React-Query/get';

const headCells = [
    {
        id: 'KycStatus',
        align: 'right',
        disablePadding: false,
        label: 'Kyc Status'
    },
    {
        id: 'frontImage',
        align: 'left',
        disablePadding: false,
        label: 'Front Image'
    },
    {
        id: 'backImage',
        align: 'left',
        disablePadding: true,
        label: 'Back Image'
    },
    {
        id: 'selfieImage',
        align: 'left',
        disablePadding: false,
        label: 'Selfie Image'
    }
];

const KycStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 1:
            color = 'warning';
            title = 'Pending';
            break;
        case 2:
            color = 'success';
            title = 'Approved';
            break;
        case 3:
            color = 'error';
            title = 'Rejected';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="start">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

KycStatus.propTypes = {
    status: PropTypes.number
};

function KycTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
KycTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
};

export default function KycTable() {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
    const [selected] = useState([]);

    const { data: kycTableData } = useFetchUserKyc('kyc-table');
    console.log('kycTableData: ', kycTableData);

    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}
                >
                    <KycTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {kycTableData?.data?.map((row, index) => {
                            const isItemSelected = isSelected(row.trackingNo);

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={index}
                                    selected={isItemSelected}
                                >
                                    <TableCell align="left">
                                        <KycStatus status={row.kycStatus} />
                                    </TableCell>
                                    <TableCell align="left">
                                        <img src={row?.kycImage?.frontImage} style={{ width: '100px', height: '100px' }} alt="frontImage" key={index} />
                                    </TableCell>
                                    <TableCell align="left">
                                        <img src={row?.kycImage?.backImage} style={{ width: '100px', height: '100px' }} alt="backImage" key={index} />
                                    </TableCell>
                                    <TableCell align="left">
                                        <img src={row?.kycImage?.selfieImage} style={{ width: '100px', height: '100px' }} alt="selfieImage" key={index} />
                                    </TableCell>
                                    {/* <TableCell component="th" scope="row" align="left">
                                        <Typography color="secondary"> {row.email} </Typography>
                                    </TableCell>
                                    <TableCell align="left">{row.username}</TableCell>
                                    <TableCell align="left">
                                        <Typography color="secondary"> {row.website_url} </Typography>
                                    </TableCell> */}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
