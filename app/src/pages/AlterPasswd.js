import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function AlterPasswd({ closeDialog }) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  let stop = false;
  const [values, setValues] = React.useState({
    new_password: { value: '', error: false },
    new_password2: { value: '', error: false },
  });
  const [helptext, setHelpText] = React.useState('');
  const handleChange = (name) => (event) => {
    setHelpText(' ');
    stop = false;
    setValues({ ...values, [name]: { error: false, value: event.target.value } });
  };
  function doLogin() {
    const url = '/api/change_password';
    const newValues = {};

    Object.keys(values).map((target) => {
      const error = values[target].value === null || values[target].value === '';
      if (error) {
        stop = true;
      }
      newValues[target] = { error, value: values[target].value };
      return error;
    });
    setValues(newValues);
    if (values.new_password.value !== values.new_password2.value) {
      setValues({ ...values, new_password2: { error: true, value: values.new_password2.value } });
      stop = true;
      setHelpText('两次密码输入不一致');
    }
    if (!stop) {
      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({ password: values.new_password.value }), // data can be `string` or {object}!
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
            closeDialog();
            enqueueSnackbar('密码修改成功', { variant: 'success', autoHideDuration: 3000 });
          }
        });
    }
    return '';
  }
  return (
    <div>
      <Dialog open="true" onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">修改密码</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Divider variant="fullWidth" />
          </DialogContentText>
          <TextField
            error={values.new_password.error}
            autoFocus
            required
            margin="dense"
            id="new_password"
            label="新密码"
            name="new_password"
            type="password"
            onChange={handleChange('new_password')}
            fullWidth
          />
          <TextField
            error={values.new_password2.error}
            autoFocus
            required
            margin="dense"
            id="new_password2"
            label="确认新密码"
            name="new_password2"
            type="password"
            onChange={handleChange('new_password2')}
            helperText={helptext}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeDialog} className={classes.button}>
              取消
          </Button>
          <Button variant="contained" onClick={doLogin} color="primary" className={classes.button}>
              提交
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
