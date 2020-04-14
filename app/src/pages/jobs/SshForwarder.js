import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import { SnackbarProvider, useSnackbar } from 'notistack';
import CssTextField from '../../components/CssTextField';
import useFetch from '../../hooks/useFetch';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(1),
  },
  margin: {
    marginTop: theme.spacing(1),
  },
  formtop: {
    marginTop: theme.spacing(2),
  },
  input: {
    margin: theme.spacing(1),
  },
  textField: {
    width: 180,
  },
  textFieldPort: {
    width: 120,
  },
  sshKeyName: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },
  sshKey: {
    width: 320,
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '90%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function NewSshForwarder(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { closeNewSshForwarder, toFlash } = props;
  const [other, setOther] = React.useState({});
  const [state, setState] = React.useState({
    docker: false,
  });
  const handleChange = (name) => (event) => {
    setOther({ ...other, [name]: event.target.value });
  };
  const handleChangeCheck = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };
  function doNew() {
    fetch('/api/ssh_forwarder', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ docker: state.docker, other }), // data can be `string` or {object}!
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
          enqueueSnackbar('端口转发新增成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeNewSshForwarder();
    toFlash(Date.now());
  }
  return (
    <>
      <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeNewSshForwarder}>
        <DialogTitle id="form-dialog-title">新建SSH转发</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Divider variant="fullWidth" />
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="normal"
            variant="outlined"
            id="comment"
            label="转发说明"
            name="comment"
            onChange={handleChange('comment')}
            fullWidth
          />
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={<Switch color="primary" checked={state.docker} onChange={handleChangeCheck('docker')} value="docker" />}
                label="指定Docker主机"
              />
              {state.docker
              && (
              <div>
                <TextField
                  id="filled-start-adornment"
                  className={clsx(classes.input, classes.textField)}
                  onChange={handleChange('base_ip')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">IP:</InputAdornment>,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="filled-start-adornment"
                  className={clsx(classes.input, classes.textFieldPort)}
                  onChange={handleChange('base_port')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Port:</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </div>
              )}
            </FormGroup>
            <FormHelperText>{state.docker ? '请注意,必须打开指定Docker主机的远程连接。' : '默认为192.168.1.30:2375'}</FormHelperText>
          </FormControl>
          <FormControl className={classes.formtop}>
            <FormLabel component="legend">转发主机</FormLabel>
            <div>
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textField)}
                onChange={handleChange('transpond_ip')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">IP:</InputAdornment>,
                }}
                variant="outlined"
              />
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textFieldPort)}
                onChange={handleChange('transpond_port')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Port:</InputAdornment>,
                }}
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textFieldPort)}
                onChange={handleChange('transpond_user')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">User:</InputAdornment>,
                }}
                variant="outlined"
              />
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textField)}
                onChange={handleChange('transpond_passwd')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Passwd:</InputAdornment>,
                }}
                variant="outlined"
              />
              <Typography className={classes.sshKeyName} variant="overline" display="block" gutterBottom>
                SSH-KEY:
              </Typography>
              <TextareaAutosize
                onChange={handleChange('transpond_key')}
                className={classes.sshKey}
                aria-label="empty textarea"
                placeholder="Ssh-Key 与 Password 至少填一项"
              />
            </div>
          </FormControl>
          <FormControl className={classes.formtop}>
            <FormLabel component="legend">目标主机</FormLabel>
            <div>
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textField)}
                onChange={handleChange('remote_ip')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">IP:</InputAdornment>,
                }}
                variant="outlined"
              />
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textFieldPort)}
                onChange={handleChange('remote_port')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Port:</InputAdornment>,
                }}
                variant="outlined"
              />
            </div>
          </FormControl>
          <FormControl className={classes.formtop}>
            <FormLabel component="legend">本地端口</FormLabel>
            <TextField
              autoFocus
              required
              className={classes.input}
              margin="normal"
              variant="outlined"
              id="local_port"
              label="Port"
              name="local_port"
              onChange={handleChange('local_port')}
              fullWidth
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeNewSshForwarder} className={classes.button}>
            取消
          </Button>
          <Button variant="contained" onClick={() => { doNew(); }} color="primary" className={classes.button}>
            提交
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function EditSshForwarder(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { sshForwarder, closeEditSshForwarder, toFlash } = props;
  const [other, setOther] = React.useState({});
  const [state, setState] = React.useState({
    docker: false,
  });
  useEffect(() => {
    if (sshForwarder !== undefined) {
      setState({ ...state, docker: sshForwarder.base_ip !== '192.168.1.30' });
      // setOther(sshForwarder);
    }
  }, [sshForwarder]);
  const handleChange = (name) => (event) => {
    setOther({ ...other, [name]: event.target.value });
  };
  const handleChangeCheck = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };
  function doEdit() {
    fetch(`/api/ssh_forwarder/${sshForwarder.id}`, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({ docker: state.docker, other }), // data can be `string` or {object}!
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
          enqueueSnackbar('编辑成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeEditSshForwarder();
    toFlash(Date.now());
  }
  if (sshForwarder !== undefined) {
    return (
      <>
      <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeEditSshForwarder}>
        <DialogTitle id="form-dialog-title">SSH转发编辑</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Divider variant="fullWidth" />
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="normal"
            variant="outlined"
            id="comment"
            label="转发说明"
            name="comment"
            defaultValue={sshForwarder.comment}
            onChange={handleChange('comment')}
            fullWidth
          />
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={<Switch color="primary" checked={state.docker} onChange={handleChangeCheck('docker')} value="docker" />}
                label="指定Docker主机"
              />
              {state.docker
              && (
                <div>
                  <TextField
                    id="filled-start-adornment"
                    className={clsx(classes.input, classes.textField)}
                    defaultValue={sshForwarder.base_ip !== '192.168.1.30' ? sshForwarder.base_ip : ''}
                    onChange={handleChange('base_ip')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">IP:</InputAdornment>,
                    }}
                    variant="outlined"
                  />
                  <TextField
                    id="filled-start-adornment"
                    className={clsx(classes.input, classes.textFieldPort)}
                    defaultValue={sshForwarder.base_ip !== '192.168.1.30' ? sshForwarder.base_port : ''}
                    onChange={handleChange('base_port')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Port:</InputAdornment>,
                    }}
                    variant="outlined"
                  />
                </div>
              )}
            </FormGroup>
            <FormHelperText>{state.docker ? '请注意,必须打开指定Docker主机的远程连接。' : '默认为192.168.1.30:2375'}</FormHelperText>
          </FormControl>
          <FormControl className={classes.formtop}>
            <FormLabel component="legend">转发主机</FormLabel>
            <div>
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textField)}
                defaultValue={sshForwarder.transpond_ip}
                onChange={handleChange('transpond_ip')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">IP:</InputAdornment>,
                }}
                variant="outlined"
              />
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textFieldPort)}
                defaultValue={sshForwarder.transpond_port}
                onChange={handleChange('transpond_port')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Port:</InputAdornment>,
                }}
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textFieldPort)}
                defaultValue={sshForwarder.transpond_user}
                onChange={handleChange('transpond_user')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">User:</InputAdornment>,
                }}
                variant="outlined"
              />
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textField)}
                defaultValue={sshForwarder.transpond_passwd}
                onChange={handleChange('transpond_passwd')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Passwd:</InputAdornment>,
                }}
                variant="outlined"
              />
              <Typography className={classes.sshKeyName} variant="overline" display="block" gutterBottom>
                SSH-KEY:
              </Typography>
              <TextareaAutosize
                defaultValue={sshForwarder.transpond_key}
                onChange={handleChange('transpond_key')}
                className={classes.sshKey}
                aria-label="empty textarea"
                placeholder="Ssh-Key 与 Password 至少填一项"
              />
            </div>
          </FormControl>
          <FormControl className={classes.formtop}>
            <FormLabel component="legend">目标主机</FormLabel>
            <div>
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textField)}
                defaultValue={sshForwarder.remote_ip}
                onChange={handleChange('remote_ip')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">IP:</InputAdornment>,
                }}
                variant="outlined"
              />
              <TextField
                id="filled-start-adornment"
                className={clsx(classes.input, classes.textFieldPort)}
                defaultValue={sshForwarder.remote_port}
                onChange={handleChange('remote_port')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Port:</InputAdornment>,
                }}
                variant="outlined"
              />
            </div>
          </FormControl>
          <FormControl className={classes.formtop}>
            <FormLabel component="legend">本地端口</FormLabel>
            <TextField
              autoFocus
              required
              className={classes.input}
              margin="normal"
              variant="outlined"
              id="local_port"
              label="Port"
              name="local_port"
              defaultValue={sshForwarder.local_port}
              onChange={handleChange('local_port')}
              fullWidth
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeEditSshForwarder} className={classes.button}>
            取消
          </Button>
          <Button variant="contained" onClick={() => { doEdit(); }} color="primary" className={classes.button}>
            提交
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }
  return null;
}

function DeleteSshForwarder(props) {
  const classes = useStyles();
  const { sshForwarder, closeDeleteSshForwarder, toFlash } = props;
  function doDelete() {
    fetch(`/api/ssh_forwarder/${sshForwarder.id}`, {
      method: 'DELETE', // or 'PUT'
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
      });
    closeDeleteSshForwarder();
    toFlash(Date.now());
  }
  if (sshForwarder !== undefined){
    return (
      <Dialog
        open
        onClose={closeDeleteSshForwarder}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"确定删除转发?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => { doDelete(); }} color="secondary">
            删除
          </Button>
          <Button onClick={closeDeleteSshForwarder} color="primary" autoFocus>
            取消
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return null;
}




function SshForwarder() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [flushPage, setFlushPage] = React.useState();
  const [getID, setGetId] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [state, setState] = React.useState({});
  const [sshForwarder, setSshForwarder] = React.useState('');
  const [showEditSshForwarder, setShowEditSshForwarder] = React.useState(false);
  const [showNewSshForwarder, setShowNewSshForwarder] = React.useState(false);
  const [showDeleteSshForwarder, setShowDeleteSshForwarder] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const sshForwarderStatus = {};
  const data = useFetch(`/api/ssh_forwarder?page=${page}&pagesize=${rowsPerPage}&id=${searchId}&sort=-id`, flushPage);
  useEffect(() => {
    if (data.list !== undefined) {
      data.list.map((forwarder) => (
        sshForwarderStatus[forwarder.id] = forwarder.status === 'enable'
      ));
      setState(sshForwarderStatus);
    }
  }, [data]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeSearch = (name) => (event) => {
    setGetId(parseInt(event.target.value, ''));
  };
  function doSearch() {
    setSearchId(getID);
    setPage(0);
    setGetId('');
  }
  function SshForwarderedit(props) {
    setSshForwarder(props);
    setShowEditSshForwarder(true);
  }
  function SshForwardernew() {
    setShowNewSshForwarder(true);
  }
  function SshForwarderdelete(props) {
    setSshForwarder(props);
    setShowDeleteSshForwarder(true);
  }
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
    const data_to_submit = { status: event.target.checked };
    fetch(`/api/ssh_forwarder/${name}`, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(data_to_submit), // data can be `string` or {object}!
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json())
      .catch((error) => {
        console.error('Error:', error);
        alert('运行错误');
      })
      .then((response) => {
        console.log('Success:', response);
        setFlushPage(Date.now());
      });
  };

  function StatusUpdate() {
    setLoading(true);
    fetch('/api/ssh_forwarder?action=update', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json())
      .catch((error) => {
        console.error('Error:', error);
        alert('运行错误');
      })
      .then((response) => {
        setLoading(false);
        console.log('Success:', response);
        setFlushPage(Date.now());
      });
  }
  function SshForwarderRestart(props) {
    fetch('/api/ssh_forwarder?action=restart', {
      method: 'POST',
      body: JSON.stringify(props),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json())
      .catch((error) => {
        console.error('Error:', error);
        alert('运行错误');
      })
      .then((response) => {
        console.log('Success:', response);
        if (response.return_code === '0000') {
          enqueueSnackbar('重启成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
  }
  if (data.list !== undefined && Object.keys(state).length === data.list.length) {
    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <div>
          <Grid container spacing={1}>
            <Grid item spacing={1}>
              <div className={classes.wrapper}>
                <CssTextField
                  autoFocus
                  variant="outlined"
                  id="search_id"
                  label="SshForwarder ID"
                  name="search_id"
                  className={classes.input}
                  onChange={handleChangeSearch('search_id')}
                />
                <Button variant="contained" color="primary" onClick={() => { doSearch(); }} className={classes.button}>
                搜索
                </Button>
                <Button variant="contained" color="primary" onClick={() => { SshForwardernew(); }} className={classes.button}>
                新建端口转发
                </Button>

                <Button variant="contained" color="primary" disabled={loading} onClick={() => { StatusUpdate(); }} className={classes.button}>
                  状态更新
                </Button>
                {loading && <CircularProgress size={24} color="secondary" className={classes.buttonProgress} />}
              </div>
            </Grid>
            <Grid item spacing={1} />
          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">转发说明</TableCell>
                  <TableCell align="center">转发主机</TableCell>
                  <TableCell align="center">目标主机</TableCell>
                  <TableCell align="center">目标端口</TableCell>
                  <TableCell align="center">连接IP</TableCell>
                  <TableCell align="center">连接端口</TableCell>
                  <TableCell align="center">创建时间</TableCell>
                  <TableCell align="center">状态</TableCell>
                  <TableCell align="center">转发状态</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.list.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.comment}</TableCell>
                    <TableCell align="center">{row.transpond_ip}</TableCell>
                    <TableCell align="center">{row.remote_ip}</TableCell>
                    <TableCell align="center">{row.remote_port}</TableCell>
                    <TableCell align="center">{row.base_ip}</TableCell>
                    <TableCell align="center">{row.local_port}</TableCell>
                    <TableCell align="center">{row.create_at}</TableCell>
                    <TableCell align="center">
                      <Switch
                        color="primary"
                        checked={state[row.id]}
                        onChange={handleChange(row.id)}
                        value={row.id}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box color={row.status_check === 'running' || row.status_check === 'None' ? 'text.primary' : 'error.main'}>{row.status_check}</Box>
                    </TableCell>
                    <TableCell align="center">
                      <ButtonGroup
                        variant="text"
                        color="primary"
                        aria-label="full-width contained primary button group"
                      >
                      <Button disabled={!state[row.id]} onClick={() => { SshForwarderRestart(row); }}>
                        重启
                      </Button>
                      <Button onClick={() => { SshForwarderedit(row); }}>
                        编辑
                      </Button>
                      <Button onClick={() => { SshForwarderdelete(row); }}>
                        删除
                      </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    // colSpan={3}
                    count={data.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    // ActionsComponent={handleChangePage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
          {showDeleteSshForwarder
           && <DeleteSshForwarder sshForwarder={sshForwarder} closeDeleteSshForwarder={() => { setShowDeleteSshForwarder(false); }} toFlash={(num) => { setFlushPage(num); }} />}
          {showEditSshForwarder
           && <EditSshForwarder sshForwarder={sshForwarder} closeEditSshForwarder={() => { setShowEditSshForwarder(false); }} toFlash={(num) => { setFlushPage(num); }} />}
          {showNewSshForwarder
          && <NewSshForwarder closeNewSshForwarder={() => { setShowNewSshForwarder(false); }} toFlash={(num) => { setFlushPage(num); }} />}
        </div>
      </SnackbarProvider>
    );
  }
  return (
    <></>
  );
}

export default SshForwarder;
