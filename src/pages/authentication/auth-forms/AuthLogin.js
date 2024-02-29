import React, { useEffect, useState } from 'react';
import PatternLock from 'react-pattern-lock';
import { useNavigate } from 'react-router-dom';
// material-ui
import { Button, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third party
// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAdminLogin } from '../../../React-Query/post';
import { toast } from 'react-hot-toast';
import OtpModal from './OtpModal';
// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [path, setPath] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState(3);
  const [openModal, setOpenModal] = useState(false);
  const [finalData, setFinalData] = useState({});
  // eslint-disable-next-line no-unused-vars
  let errorTimeout = 0;
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = (e) => {
    setOpenModal(false);
    finalSubmitFunction(e);
  };
  useEffect(() => {
    const handleKeyDown = ({ which }) => {
      if (which === 38) {
        setSize((prevSize) => (prevSize >= 10 ? 10 : prevSize + 1));
      } else if (which === 40) {
        setSize((prevSize) => (prevSize > 3 ? prevSize - 1 : 3));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const onChange = (path) => {
    setPath([...path]);
  };

  const onFinish = () => {
    setIsLoading(true);
    // an imaginary api call
    setTimeout(() => {
      if (path.join('-') === '0-1-2') {
        setIsLoading(false);
        setSuccess(true);
        setDisabled(true);
      } else {
        setDisabled(true);
        setError(true);
        errorTimeout = window.setTimeout(() => {
          setDisabled(false);
          setError(false);
          setIsLoading(false);
          setPath([]);
        }, 2000);
      }
    }, 1000);
  };

  const defaultValues = {
    email: '',
    password: ''
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Invalid Email')
      .required('Email is Required')
      .min(10, 'Email must be at least 10 characters')
      .max(140, 'Email must be at most 140 characters'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(30, 'Password must be at most 30 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,30}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      )
      .required('Password is Required')
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset
  } = useForm({ mode: 'onChange', defaultValues: defaultValues, resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const userLoginMutation = useAdminLogin();

  const onSubmit = async ({ email, password }) => {
    let pattern = path.join('');
    if (pattern) {
      const loginData = {
        email,
        password,
        pattern
      };
      setFinalData(loginData);
      handleOpenModal();
      return;
    } else {
      toast.error('Please Draw a Pattern');
    }
  };

  const finalSubmitFunction = (e) => {
    if (finalData) {
      userLoginMutation.mutate(
        { ...finalData, otp: e },
        {
          onSuccess: (data) => {
            if (data?.data?.status === true) {
              toast.success(data?.data?.message);
              navigate('/dashboard/default');
              reset();
            } else {
              toast.error(data.data.message);
            }
          },
          onError: (error) => {
            toast.error(error.message);
          }
        }
      );
    }
  };
  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel htmlFor="email-login">Email Address</InputLabel>
                    <OutlinedInput {...field} id="email-login" type="email" name="email" placeholder="Enter email address" fullWidth />
                  </>
                )}
              />
              <ErrorMessage errors={errors} name="email" render={({ message }) => <p style={{ color: 'red' }}> {message} </p>} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel htmlFor="password-login">Password</InputLabel>
                    <OutlinedInput
                      {...field}
                      fullWidth
                      id="-password-login"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="Enter password"
                    />
                  </>
                )}
              />
              <ErrorMessage errors={errors} name="password" render={({ message }) => <p style={{ color: 'red' }}> {message} </p>} />
            </Stack>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3, ml: 3 }} style={{ backgroundColor: '#0958D9' }}>
            <Stack spacing={1}>
              <PatternLock
                style={{ ml: -3 }}
                size={size}
                onChange={onChange}
                path={path}
                error={error}
                onFinish={onFinish}
                connectorThickness={3}
                disabled={disabled || isLoading}
                success={success}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting || !isValid}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
      <OtpModal open={openModal} onClose={handleCloseModal} />
    </>
  );
};

export default AuthLogin;
