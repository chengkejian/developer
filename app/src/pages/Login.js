import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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

function SignIn() {
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const [values, setValues] = useState({
    name: { value: '', error: false },
    password: { value: '', error: false },
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: { error: false, value: event.target.value } });
  };

  function doLogin() {
    console.log(`doLogin:${values.name.value}`);
    const url = '/api/login';
    const newValues = {};

    let stop = false;
    Object.keys(values).map((target) => {
      const error = values[target].value === null || values[target].value === '';
      if (error) {
        stop = true;
      }
      newValues[target] = { error, value: values[target].value };
      return error;
    });
    setValues(newValues);
    if (stop) {
      return stop;
    }
    const data = { name: values.name.value, password: values.password.value };
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
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
          response.return_msg ? window.location.href=response.return_msg : window.location.replace('/i');
        } else {
          enqueueSnackbar(response.data, { variant: 'error', autoHideDuration: 3000 });
        }
      });
    return stop;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          登录
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            error={values.name.error}
            variant="outlined"
            margin="normal"
            required="true"
            fullWidth
            id="name"
            label="姓名"
            name="name"
            autoComplete="fullname"
            autoFocus
            onChange={handleChange('name')}
          />
          <TextField
            error={values.password.error}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange('password')}
          />
          <Button
            onClick={doLogin}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            登录
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {'注册'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <SignIn />
    </SnackbarProvider>
  );
}
