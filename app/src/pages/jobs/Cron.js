import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ReactRouterPropTypes from 'react-router-prop-types';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Drawer from '@material-ui/core/Drawer';
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
  logList: {
    width: 500,
  },
}));

function CronEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const {
    cron, runners, closeEditCron, toFlash,
  } = props;
  const [other, setOther] = React.useState({});
  const [runner, setRunner] = React.useState('');
  const handleChange = (name) => (event) => {
    setOther({ ...other, [name]: event.target.value });
  };
  const handleChangeRunner = (event) => {
    setRunner(event.target.value);
  };
  useEffect(() => {
    if (cron !== undefined && runners.list !== undefined) {
      setRunner(cron.runner_id);
      setOther({ ...other, name: cron.name, cron: cron.cron });
    }
  }, [runners]);
  function doEdit() {
    const url = `/api/cron/${cron.id}`;
    fetch(url, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({ runner_id: runner, other }), // data can be `string` or {object}!
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
          enqueueSnackbar('定时任务修改成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeEditCron();
    toFlash(Date.now());
  }
  if (runner !== undefined && runners.list !== undefined) {
    return (
      <>
        <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeEditCron}>
          <DialogTitle id="form-dialog-title">修改定时任务</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Divider variant="fullWidth" />
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="name"
              label="NAME"
              name="name"
              onChange={handleChange('name')}
              defaultValue={cron.name}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="cron"
              label="定时器(分 时 日 月 周)"
              name="cron"
              onChange={handleChange('cron')}
              defaultValue={cron.cron}
              fullWidth
            />
            <FormControl margin="normal" fullWidth>
              <FormLabel component="legend">执行器</FormLabel>
              <Select
                id="runner"
                value={runner}
                onChange={handleChangeRunner}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {runners.list.map((runner) => (
                  <MenuItem value={runner.id}>
                    {runner.id}
.
                    {runner.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={closeEditCron} className={classes.button}>
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

function CronNew(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { runners, closeNewCron, toFlash } = props;
  const [other, setOther] = React.useState({});
  const [runner, setRunner] = React.useState('');
  const handleChange = (name) => (event) => {
    setOther({ ...other, [name]: event.target.value });
  };
  const handleChangeRunner = (event) => {
    setRunner(event.target.value);
  };
  function doNew() {
    fetch('/api/cron', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ runner_id: runner, other }), // data can be `string` or {object}!
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
          enqueueSnackbar('定时任务新增成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeNewCron();
    toFlash(Date.now());
  }
  if (runners.list !== undefined) {
    return (
      <>
        <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeNewCron}>
          <DialogTitle id="form-dialog-title">新建定时任务</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Divider variant="fullWidth" />
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="name"
              label="NAME"
              name="name"
              onChange={handleChange('name')}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="cron"
              label="定时器(分 时 日 月 周)"
              name="cron"
              onChange={handleChange('cron')}
              fullWidth
            />
            <FormControl margin="normal" fullWidth>
              <FormLabel component="legend">执行器</FormLabel>
              <Select
                id="runner"
                value={runner}
                onChange={handleChangeRunner}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {runners.list.map((runner) => (
                  <MenuItem value={runner.id}>
                    {runner.id}
.
                    {runner.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={closeNewCron} className={classes.button}>
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
  return null;
}


function LogShow(props) {
  const classes = useStyles();
  const { log, closeShowLog } = props;
  return (
    <Drawer anchor="right" open="true" onClose={closeShowLog}>
      <div className={classes.logList}>
        <Typography variant="h5" component="h2" gutterBottom>
        任务日志:
        </Typography>
        <Typography variant="body1" gutterBottom>
          执行时间：
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {log !== null ? log.create_at: 'None'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          执行结果：
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {log !== null ? JSON.stringify(log.resutl) : 'None'}
        </Typography>
      </div>
    </Drawer>

  );
}

function Cron() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showEditCron, setShowEditCron] = React.useState(false);
  const [showNewCron, setShowNewCron] = React.useState(false);
  const [showLog, setShowLog] = React.useState(false);
  const [searchId, setSearchId] = React.useState('');
  const [getID, setGetId] = React.useState('');
  const [flushPage, setFlushPage] = React.useState();
  const [state, setState] = React.useState({});
  const [log, setLog] = React.useState({});
  const data = useFetch(`/api/cron?page=${page}&pagesize=${rowsPerPage}&id=${searchId}&sort=-id`, flushPage);
  const runners = useFetch('/api/runner?page=False&sort=-id');
  const [cron, setCron] = React.useState('');
  const cronStatus = {};
  useEffect(() => {
    if (data.list !== undefined) {
      data.list.map((cronList) => (
        cronStatus[cronList.id] = cronList.status === 'enable'
      ));
      setState(cronStatus);
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
  function Cronedit(props) {
    setCron(props);
    setShowEditCron(true);
  }
  function Cronnew() {
    setShowNewCron(true);
  }
  function Logshow(props) {
    setLog(props.log);
    setShowLog(true);
  }
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
    const data_to_submit = { status: event.target.checked };
    fetch(`/api/cron/${name}`, {
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
  if (data.list !== undefined && Object.keys(state).length === data.list.length) {
    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <div>
          <Grid container spacing={1}>
            <Grid item spacing={1}>
              <CssTextField
                autoFocus
                variant="outlined"
                id="search_id"
                label="Cron ID"
                name="search_id"
                className={classes.input}
                onChange={handleChangeSearch('search_id')}
              />
              <Button variant="contained" color="primary" onClick={() => { doSearch(); }} className={classes.button}>
                搜索
              </Button>
              <Button variant="contained" color="primary" onClick={() => { Cronnew(); }} className={classes.button}>
                新建定时任务
              </Button>
            </Grid>
            <Grid item spacing={1} />
          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">name</TableCell>
                  <TableCell align="center">执行器</TableCell>
                  <TableCell align="center">定时器（分 时 日 月 周）</TableCell>
                  <TableCell align="center">创建人</TableCell>
                  <TableCell align="center">创建时间</TableCell>
                  <TableCell align="center">状态</TableCell>
                  <TableCell align="center">下一次执行时间</TableCell>
                  <TableCell align="center">最近一次执行状态</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.list.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.runner}</TableCell>
                    <TableCell align="center">{row.cron}</TableCell>
                    <TableCell align="center">{row.user}</TableCell>
                    <TableCell align="center">{row.create_at}</TableCell>
                    <TableCell align="center">
                      <Switch
                        color="primary"
                        checked={state[row.id]}
                        onChange={handleChange(row.id)}
                        value={row.id}
                      />
                    </TableCell>
                    <TableCell align="center">{row.next_run === '2000-01-01 00:00:00' ? 'None' : row.next_run}</TableCell>
                    <TableCell align="center">
                      <Box color={row.last_status === 'fail' ? 'error.main' : 'text.primary'}>{row.last_status}</Box>
                    </TableCell>
                    <TableCell align="center">
                      <Button color="primary" onClick={() => { Cronedit(row); }}>
                        编辑
                      </Button>
                      <Button color="primary" onClick={() => { Logshow(row); }}>
                        日志
                      </Button>

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
            {showLog
          && <LogShow log={log} closeShowLog={() => { setShowLog(false); }} />}
          </Paper>
          {showEditCron
          && <CronEdit cron={cron} runners={runners} closeEditCron={() => { setShowEditCron(false); }} toFlash={(num) => { setFlushPage(num); }} />}
          {showNewCron
          && <CronNew runners={runners} closeNewCron={() => { setShowNewCron(false); }} toFlash={(num) => { setFlushPage(num); }} />}
        </div>
      </SnackbarProvider>
    );
  }
  return (
    <></>
  );
}


export default Cron;
