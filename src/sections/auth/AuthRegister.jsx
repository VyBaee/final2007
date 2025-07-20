import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false); // Track if the verification code has been sent
  const [isCodeVerified, setIsCodeVerified] = useState(false); // Track if the verification code has been verified

  const handleClickShowPassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Hàm để gửi yêu cầu đến API
  const callApi = async (url, method, data) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Kiểm tra xem response có thành công không (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('API Error:', error);
      alert('Có lỗi khi kết nối với server: ' + error.message);
      return null;
    }
  };

  // Bước 1: Gửi mã xác nhận email
  const handleSendVerificationCode = async (email, setFieldValue) => {
    const data = { email };
    const response = await fetch('http://192.168.86.120:8080/api/v1/sendVerificationCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Đảm bảo header này đúng
      },
      body: JSON.stringify(data),
    });

    if (response) {
      setIsCodeSent(true); // Enable email verification code field
      alert('Verification code sent successfully!');
    } else {
      alert('Error sending verification code.');
    }

    // Tránh làm mất giá trị mã xác thực trong Formik
    setFieldValue("emailVerificationCode", ""); // Optional: clear the field if needed
  };

  // Bước 2: Xác nhận mã
  const handleVerifyCode = async (email, code) => {
    const data = { email, code };
    const response = await callApi('http://192.168.86.120:8080/api/v1/verifyCode', 'POST', data);

    if (response && response.success) {
      setIsCodeVerified(true); // Mark as verified
      alert('Verification code verified!');
      return true;
    } else {
      alert('Invalid verification code');
      return false;
    }
  };

  // Bước 3: Đăng ký tài khoản
  const handleRegisterAccount = async (values) => {
    const { email, password, confirmPassword } = values;

    // Nếu đã xác nhận mã thì mới tiến hành đăng ký
    if (!isCodeVerified) {
      alert('Please verify the code before creating an account.');
      return;
    }

    try {
      const response = await fetch('http://192.168.86.120:8080/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Account registered successfully!');
      } else {
        alert(data.message || 'Account registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server');
    }
  };





  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
        emailVerificationCode: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        password: Yup.string()
          .required('Password is required')
          .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
          .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required'),
        emailVerificationCode: Yup.string()
          .required('Email verification code is required'),
      })}
      onSubmit={(values) => handleSubmit(values)} // Gọi hàm submit khi form được submit
    >
      {({ errors, handleBlur, handleChange, touched, values, setFieldValue }) => (
        <form noValidate>
          <Grid container spacing={3}>
            {/* Email */}
            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  id="email-signup"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="demo@company.com"
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error id="helper-text-email-signup">
                  {errors.email}
                </FormHelperText>
              )}
            </Grid>

            {/* Send Verification Code */}
            <Grid item xs={12}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                color="primary"
                onClick={() => handleSendVerificationCode(values.email, setFieldValue)}
                disabled={isCodeSent} // Disable after the code is sent
              >
                {isCodeSent ? 'Code Sent' : 'Send Verification Code'}
              </Button>
            </Grid>

            {/* Email Verification Code */}
            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="email-verification-code">Verification Code*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.emailVerificationCode && errors.emailVerificationCode)}
                  id="email-verification-code"
                  value={values.emailVerificationCode}
                  name="emailVerificationCode"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter verification code"
                />
              </Stack>
              {touched.emailVerificationCode && errors.emailVerificationCode && (
                <FormHelperText error id="helper-text-email-verification-code">
                  {errors.emailVerificationCode}
                </FormHelperText>
              )}
            </Grid>

            {/* Verify Code Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                color="primary"
                onClick={() => handleVerifyCode(values.email, values.emailVerificationCode)}
                disabled={isCodeVerified || !isCodeSent} // Disable after verification is done or if code hasn't been sent
              >
                {isCodeVerified ? 'Code Verified' : 'Verify Code'}
              </Button>
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="password-signup">Password*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-signup"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword('password')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="******"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error id="helper-text-password-signup">
                  {errors.password}
                </FormHelperText>
              )}
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="confirm-password-signup">Confirm Password*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  id="confirm-password-signup"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => handleClickShowPassword('confirmPassword')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="******"
                />
              </Stack>
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="helper-text-confirm-password-signup">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                onClick={() => handleRegisterAccount(values)} // Thêm onClick để gọi API đăng ký
                disabled={!isCodeVerified} // Chỉ cho phép nhấn nếu mã xác thực đã được xác minh
              >
                Create Account
              </Button>
            </Grid>


          </Grid>
        </form>
      )}
    </Formik>
  );
}
