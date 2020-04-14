import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import { SnackbarProvider, useSnackbar } from 'notistack';

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
    marginTop: theme.spacing(1),
  },
}));
function isInArray(search, array) {
  for (const i in array) {
    if (array[i] === search) {
      return true;
    }
  }
  return false;
}

function JobeNew(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { closeNewJob, toFlash } = props;
  const roles = useFetch('/api/roles?sort=-id');
  const [state, setState] = React.useState({});
  const [other, SetOther] = React.useState({});
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };
  const handleChangeText = (name) => (event) => {
    SetOther({ ...other, [name]: event.target.value });
  };
  function doNew() {
    fetch('/api/jobs_list', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ roles: state, other }), // data can be `string` or {object}!
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
          enqueueSnackbar('job新增成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeNewJob();
    toFlash(Date.now());
  }
  if (roles.list !== undefined) {
    return (
      <>
        <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeNewJob}>
          <DialogTitle id="form-dialog-title">新建任务</DialogTitle>
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
              onChange={handleChangeText('name')}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="executer_id"
              label="executer_id"
              name="executer_id"
              onChange={handleChangeText('executer_id')}
              fullWidth
            />
            <FormControl margin="normal">
              <FormLabel component="legend">权限</FormLabel>
              <FormGroup row>
                {roles.list.map((role) => (
                  <FormControlLabel
                    control={(
                      <Checkbox
                        onChange={handleChange(role.role_code)}
                        value={role.id}
                        color="primary"
                      />
                )}
                    label={role.role_desc}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={closeNewJob} className={classes.button}>
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

function JobeEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { job, closeEidtJob, toFlash } = props;
  const roles = useFetch('/api/roles?sort=-id');
  const [state, setState] = React.useState({});
  const [other, setOther] = React.useState({});
  const jobRoleStatus = {};
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };
  const handleChangeText = (name) => (event) => {
    setOther({ ...other, [name]: event.target.value });
  };
  useEffect(() => {
    if (job !== undefined && roles.list !== undefined) {
      roles.list.map((role) => (
        jobRoleStatus[role.id] = isInArray(role.role_desc, job.roles_view)
      ));
      setState(jobRoleStatus);
      setOther({ ...other, name: job.name, executer_id: job.executer_id });
    }
  }, [roles]);
  function doEdit() {
    const url = `/api/jobs_list/${job.id}`;
    fetch(url, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({ roles: state, other }), // data can be `string` or {object}!
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
          enqueueSnackbar('job修改成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeEidtJob();
    toFlash(Date.now());
  }
  if (job !== undefined && roles.list !== undefined) {
    return (
      <>
        <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeEidtJob}>
          <DialogTitle>编辑任务</DialogTitle>
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
              onChange={handleChangeText('name')}
              defaultValue={job.name}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="executer_id"
              label="executer_id"
              name="executer_id"
              onChange={handleChangeText('executer_id')}
              defaultValue={job.executer_id}
              fullWidth
            />
            <FormControl margin="normal">
              <FormLabel component="legend">权限</FormLabel>
              <FormGroup row>
                {roles.list.map((role) => (
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={state[role.id]}
                        onChange={handleChange(role.id)}
                        value={role.id}
                        color="primary"
                      />
                  )}
                    label={role.role_desc}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={closeEidtJob} className={classes.button}>
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

function JobsList({ match }) {
  const classes = useStyles();
  // const page = match.params.page ? match.params.page : 0;
  const [showEditJob, setShwoEditJob] = React.useState(false);
  const [showNewJob, setShwoNewJob] = React.useState(false);
  const [flushPage, setFlushPage] = React.useState();
  const data = useFetch(`/api/jobs_list?page=${match.params.page}&sort=-id`, flushPage);
  const [job, setJob] = React.useState('');
  function Jobedit(props) {
    setJob(props);
    setShwoEditJob(true);
  }
  function Jobenew() {
    setShwoNewJob(true);
  }
  const [state, setState] = React.useState({});
  const jobStatus = {};
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
    const data_to_submit = { status: event.target.checked };
    fetch(`/api/jobs_list/${name}`, {
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
      });
  };
  useEffect(() => {
    if (data.list !== undefined) {
      data.list.map((jobList) => (
        jobStatus[jobList.id] = jobList.status === 'true'
      ));
      setState(jobStatus);
    }
  }, [data]);

  if (data.list !== undefined && Object.keys(state).length === data.list.length) {
    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <div>
          <Button variant="contained" color="primary" onClick={() => { Jobenew(); }} className={classes.button}>
            新建Job
          </Button>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="center">NAME</TableCell>
                  <TableCell align="center">executer_id</TableCell>
                  <TableCell align="center">权限</TableCell>
                  <TableCell align="center">状态</TableCell>
                  <TableCell align="center">创建时间</TableCell>
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
                    <TableCell align="center">{row.executer_id}</TableCell>
                    <TableCell align="center">
                      {row.roles_view.map((role) => (
                        <Chip size="small" label={role} />
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        color="primary"
                        checked={state[row.id]}
                        onChange={handleChange(row.id)}
                        value={row.id}
                      />
                    </TableCell>
                    <TableCell align="center">{row.create_at}</TableCell>
                    <TableCell align="center">
                      <Button color="primary" onClick={() => { Jobedit(row); }}>
                    编辑
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          {showEditJob
        && <JobeEdit job={job} closeEidtJob={() => { setShwoEditJob(false); }} toFlash={(num) => { setFlushPage(num); }} />}
          {showNewJob
        && <JobeNew closeNewJob={() => { setShwoNewJob(false); }} toFlash={(num) => { setFlushPage(num); }} />}
        </div>
      </SnackbarProvider>
    );
  }
  return (
    <></>
  );
}

JobsList.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default JobsList;
