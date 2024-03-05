import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import KycTable from './Kyctable';

const DashboardKyc = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">KYC</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <KycTable />
                </MainCard>
            </Grid>
        </Grid>
    );
};
export default DashboardKyc;
