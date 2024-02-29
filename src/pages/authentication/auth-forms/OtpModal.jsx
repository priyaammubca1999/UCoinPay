import React, { useState } from 'react';
import { Modal, Backdrop, Fade, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const OtpModal = ({ open, onClose }) => {
  const [otp, setOtp] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('OTP submitted:', otp);
    onClose(otp);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Fade in={open}>
          <div style={{ backgroundColor: '#424242', padding: '20px', borderRadius: '8px', width: '300px' }}>
            <h2 style={{ textAlign: 'center', color: '#fff' }}>Enter OTP</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                label="OTP"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 6 }}
                required
              />
              <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px', width: '100%' }}>
                Submit
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default OtpModal;
