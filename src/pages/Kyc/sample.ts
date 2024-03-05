import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, Modal } from '@material-ui/core';
import { useLocation } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  imageContainer: {
    position: 'relative',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    '&:hover $image': {
      transform: 'scale(1.1)'
    }
  },
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: '200px',
    border: '1px solid #ccc',
    transition: 'transform 0.2s ease-in-out'
  },
  imageTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: theme.spacing(1),
    width: '100%',
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: theme.spacing(2)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalImage: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain'
  }
}));

const KycDetail = () => {
  const location = useLocation();
  const images = location?.state?.data?.kycImage || [];
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handle = (type) => {
    if (type === 'approve') {
      console.log('Approve');
    } else {
      console.log('Reject');
    }
  };

  return (
    <Fragment>
      <div className={classes.root}>
        <Grid container spacing={2} alignItems="center">
          {Object.entries(images).map(([key, value]) => (
            <Grid item xs={4} key={key}>
              <div className={classes.imageContainer} onClick={() => handleImageClick(value)}>
                <Typography variant="subtitle1" className={classes.imageTitle}>
                  {key}
                </Typography>
                <img src={value} alt={key} className={classes.image} />
              </div>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} justify="center" className={classes.buttonContainer}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => handle('approve')}>
              Approve
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => handle('reject')}>
              Reject
            </Button>
          </Grid>
        </Grid>
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className={classes.modal}
      >
        <img src={modalImage} alt="Enlarged" className={classes.modalImage} />
      </Modal>
    </Fragment>
  );
};

export default KycDetail;
