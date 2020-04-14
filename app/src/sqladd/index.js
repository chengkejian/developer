import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Controlled as CodeMirror } from 'react-codemirror2';

require('codemirror/mode/sql/sql');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
    >
      {'Copyright © '}
      <Link
        color="inherit"
        href="https://developers.aibili.com/"
      >
        爱彼利科技
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'. Built with '}
      <Link
        color="inherit"
        href="https://material-ui.com/"
      >
        Material-UI.
      </Link>
    </Typography>
  );
}

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

export default function SignIn(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    title: '',
    sql: '',
    db: '',
  });

  function sqladd() {
    console.log(values);
    const url = '/api/sqls';

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(values), // data can be `string` or {object}!
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
          props.history.replace('/i/sql');
        } else {
          alert('Error');
        }
      });
  }
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" />
        <form className={classes.form} noValidate>
          <TextField
            id="standard-name"
            label="说明"
            className={classes.textField}
            value={values.title}
            fullWidth
            onChange={handleChange('title')}
            margin="normal"
          />
          SQL
          <CodeMirror
            value={values.sql}
            options={{
              lineWrapping: true,
              mode: 'sql',
              theme: 'material',
            }}
            onBeforeChange={(editor, data, value) => {
              setValues({ ...values, sql: value });
            }
          }
          />
          <RadioGroup
            aria-label="db"
            name="db"
            className={classes.group}
            value={values.db}
            onChange={handleChange('db')}
          >
            <FormControlLabel value="pre" control={<Radio />} label="预发布" />
            <FormControlLabel value="prd" control={<Radio />} label="生产" />
          </RadioGroup>
          <Button
            onClick={sqladd}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
          添加
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
