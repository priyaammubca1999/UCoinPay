import { Fragment, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Grid, Typography, Dialog, DialogContent } from '@material-ui/core';
import Button from '@mui/material/Button';
import MainCard from 'components/MainCard';
import { useKycAction } from '../../React-Query/post';
import { queryClient } from 'React-Query/index';
import { toast } from 'react-hot-toast';

const KycDetail = () => {
  const location = useLocation();
  const images = location?.state?.data?.kycImage || [];
  const u_id = location?.state?.data?.u_id || null;
  const status = location?.state?.data?.kycStatus || null;
  const navigate = useNavigate();

  const [modalImage, setModalImage] = useState(null);
  const userKycMutation = useKycAction();

  const handleOpenModal = (image) => {
    setModalImage(image);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  const handleKycAction = (type) => ({ u_id, kycStatus: type === 'approve' ? 2 : 3 });

  const handle = async (type) => {
    const obj = handleKycAction(type);
    const { data } = await userKycMutation.mutateAsync(obj);
    console.log('data: ', data);

    if (data.status) {
      toast.success(data.message);
      navigate('/dashboard/kyc');
    } else toast.error(data.message);

    await queryClient.refetchQueries('kyc-table');
  };

  return (
    <Fragment>
      <Grid style={{ marginBottom: '2rem' }}>
        <Typography variant="h5">User's KYC</Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <MainCard title="Front Image" onClick={() => handleOpenModal(images?.frontImage)}>
            <img src={images?.frontImage} alt="frontImage" style={{ width: '350px', height: '250px' }} />
          </MainCard>
        </Grid>
        <Grid item xs={4}>
          <MainCard title="Back Image" onClick={() => handleOpenModal(images?.backImage)}>
            <img src={images?.backImage} alt="backImage" style={{ width: '350px', height: '250px' }} />
          </MainCard>
        </Grid>
        <Grid item xs={4}>
          <MainCard title="Selfie Image" onClick={() => handleOpenModal(images?.selfieImage)}>
            <img src={images?.selfieImage} alt="selfieImage" style={{ width: '350px', height: '250px' }} />
          </MainCard>
        </Grid>
      </Grid>
      <Dialog open={Boolean(modalImage)} onClose={handleCloseModal} fullWidth="md" maxWidth="md">
        <DialogContent>
          <img src={modalImage} alt="modalImage" style={{ width: '100%', height: '100%' }} />
        </DialogContent>
      </Dialog>
      <Grid container spacing={2} justify="center" style={{ marginTop: '2rem' }}>
        <Grid item xs={12} md={6} lg={4} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            disabled={status !== 1 ? true : false}
            style={{ marginRight: '8px' }}
            onClick={() => handle('approve')}
          >
            Approve
          </Button>
          <Button variant="contained" color="error" disabled={status !== 1 ? true : false} onClick={() => handle('reject')}>
            Reject
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default KycDetail;
