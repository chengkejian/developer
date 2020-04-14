import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { SnackbarProvider, useSnackbar } from 'notistack';

import Copyright from '../components/Copyright';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Register(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: { value: '', error: false },
    password: { value: '', error: false },
    mobile: { value: '', error: false },
  });

  function register() {
    console.log(values);
    const url = '/api/register';

    const newValues = {};
    const valuesToSubmit = {};

    let stop = false;
    Object.keys(values).map((target) => {
      const error = values[target].value === null || values[target].value === '';
      newValues[target] = { error, value: '' };
      valuesToSubmit[target] = values[target].value;
      if (error) {
        stop = true;
      }
      return error;
    });
    setValues(newValues);
    if (stop) {
      return stop;
    }
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(valuesToSubmit), // data can be `string` or {object}!
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json())
      .catch((error) => {
        console.error('Error:', error);
        alert('Error');
      })
      .then((response) => {
        console.log('Success:', response);
        if (response.return_code === '0000') {
          enqueueSnackbar('注册成功，请通知管理员激活账号后登录', { variant: 'info', autoHideDuration: 3000 });
          window.setTimeout(()=>{window.location='/login'}, 3000);
        } else {
          enqueueSnackbar('注册失败，咨询管理员寻求帮助', { variant: 'error', autoHideDuration: 3000 });
        }
      });
    return stop;
  }
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: { error: false, value: event.target.value } });
  };

  return (

    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>

        <Typography component="h1" variant="h5">
    注册
        </Typography>

        <form className={classes.form} noValidate>
          <TextField
            id="standard-mobile"
            label="手机号"
            error={values.mobile.error}

            className={classes.textField}
            value={values.title}
            fullWidth
            onChange={handleChange('mobile')}
            margin="normal"
            color="primary"
          />
          <TextField
            id="standard-name"
            label="姓名（中文全名）"
            error={values.name.error}

            className={classes.textField}
            value={values.title}
            fullWidth
            onChange={handleChange('name')}
            margin="normal"
          />
          <TextField
            id="standard-password"
            error={values.password.error}

            label="密码"
            className={classes.textField}
            value={values.title}
            fullWidth
            type="password"
            onChange={handleChange('password')}
            margin="normal"
          />
          <Button
            onClick={register}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
          注册
          </Button>
        </form>
      </div>
      <Link href="/login" variant="body2">
            登录
      </Link>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>


  );
}
export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Register />
    </SnackbarProvider>
  );
}
