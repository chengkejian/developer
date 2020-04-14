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
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Controlled as CodeMirror } from 'react-codemirror2';
import useFetch from '../../hooks/useFetch';
import CssTextField from '../../components/CssTextField';

require('codemirror/mode/javascript/javascript.js');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');


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
  formControl: {
   // margin: theme.spacing(1),
    //marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  input: {
    margin: theme.spacing(1),
  },
  margin: {
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

function JobItemNew(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { closeNewJobItem, toFlash } = props;
  const roles = useFetch('/api/roles?sort=-id');
  const [state, setState] = React.useState({});
  const [other, setOther] = React.useState({});
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };
  const handleChangeText = (name) => (event) => {
    setOther({ ...other, [name]: event.target.value });
  };
  function doNew() {
    fetch('/api/jobs_items', {
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
          enqueueSnackbar('job_item新增成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeNewJobItem();
    toFlash(Date.now());
  }
  if (roles.list !== undefined) {
    return (
      <>
        <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeNewJobItem}>
          <DialogTitle id="form-dialog-title">新建JobItem</DialogTitle>
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
              id="job_id"
              label="job_id"
              name="job_id"
              onChange={handleChangeText('job_id')}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="start_status"
              label="start_status"
              name="start_status"
              onChange={handleChangeText('start_status')}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="operator"
              label="operator"
              name="operator"
              onChange={handleChangeText('operator')}
              fullWidth
            />
            <FormControl fullWidth>
              <FormLabel component="legend" className={classes.margin}>Argument</FormLabel>
                    <CodeMirror
                      className={classes.margin}
                      value={other.arguments}
                      options={{
                        lineWrapping: true,
                        mode: 'javascript',
                        theme: 'material',
                      }}
                      onBeforeChange={(editor, data, value) => {
                        setOther({ ...other, arguments: value });
                      }}
                    />
            </FormControl>
            <TextField
              autoFocus
              required
              margin="normal"
              variant="outlined"
              id="end_status"
              label="end_status"
              name="end_status"
              onChange={handleChangeText('end_status')}
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
            <Button variant="contained" onClick={closeNewJobItem} className={classes.button}>
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

function JobItemEdit(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { jobitem, closeEidtJobItem, toFlash } = props;
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
    if (jobitem !== undefined && roles.list !== undefined) {
      roles.list.map((role) => (
        jobRoleStatus[role.id] = isInArray(role.role_desc, jobitem.roles)
      ));
      setState(jobRoleStatus);
      setOther({ ...other, arguments: jobitem.arg });
    }
  }, [roles]);
  function doEdit() {
    const url = `/api/jobs_items/${jobitem.id}`;
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
    closeEidtJobItem();
    toFlash(Date.now());
  }
  if (jobitem !== undefined && roles.list !== undefined) {
    return (
      <>
      <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeEidtJobItem}>
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
            defaultValue={jobitem.name}
            fullWidth
          />
          <TextField
            autoFocus
            required
            margin="normal"
            variant="outlined"
            id="job_id"
            label="job_id"
            name="job_id"
            onChange={handleChangeText('job_id')}
            defaultValue={jobitem.job_id}
            fullWidth
          />
          <TextField
            autoFocus
            required
            margin="normal"
            variant="outlined"
            id="start_status"
            label="start_status"
            name="start_status"
            onChange={handleChangeText('start_status')}
            defaultValue={jobitem.start_status}
            fullWidth
          />
          <TextField
            autoFocus
            required
            margin="normal"
            variant="outlined"
            id="operator"
            label="operator"
            name="operator"
            onChange={handleChangeText('operator')}
            defaultValue={jobitem.operator}
            fullWidth
          />
          <FormControl fullWidth>
            <FormLabel component="legend" className={classes.margin}>Argument</FormLabel>
            <CodeMirror
              id="argument"
              name="argument"
              className={classes.margin}
              value={JSON.stringify(other.arguments)}
              options={{
                lineWrapping: true,
                mode: 'javascript',
                theme: 'material',
              }}
              onBeforeChange={(editor, data, value) => {
                setOther({ ...other, arguments: value });
              }}
            />
          </FormControl>
          <TextField
            autoFocus
            required
            margin="normal"
            variant="outlined"
            id="end_status"
            label="end_status"
            name="end_status"
            onChange={handleChangeText('end_status')}
            defaultValue={jobitem.end_status}
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
          <Button variant="contained" onClick={closeEidtJobItem} className={classes.button}>
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

function JobsItems() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showEditJobItem, setShowEditJobItem] = React.useState(false);
  const [showNewJobItem, setShowNewJobItem] = React.useState(false);
  const [searchId, setSearchId] = React.useState('');
  const [getID, setGetId] = React.useState('');
  const [flushPage, setFlushPage] = React.useState();
  const data = useFetch(`/api/jobs_items?page=${page}&pagesize=${rowsPerPage}&job_id=${searchId}&sort=-job_id`, flushPage);
  const [job, setJob] = React.useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeSearch = (name) => (event) => {
    setGetId(parseInt(event.target.value, ''));
  };
  function doSearch() {
    setSearchId(getID);
    setPage(0);
  }
  function Jobitemedit(props) {
    setJob(props);
    setShowEditJobItem(true);
  }
  function Jobitemnew() {
    setShowNewJobItem(true);
  }

  if (data.list !== undefined) {
    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <div>
          <Grid container spacing={1}>
          <Grid item spacing={1}>
            <CssTextField
              autoFocus
              variant="outlined"
              id="search_id"
              label="Job ID"
              name="search_id"
              className={classes.input}
              onChange={handleChangeSearch('search_id')}
            />
            <Button variant="contained" color="primary" onClick={() => { doSearch(); }} className={classes.button}>
              搜索
            </Button>
          <Button variant="contained" color="primary" onClick={() => { Jobitemnew(); }} className={classes.button}>
            新建Job_Items
          </Button>
          </Grid>
          <Grid item spacing={1}>
          </Grid>
        </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">JOB_ID</TableCell>
                  <TableCell align="center">name</TableCell>
                  <TableCell align="center">start_status</TableCell>
                  <TableCell align="center">operator</TableCell>
                  <TableCell align="center">arguments</TableCell>
                  <TableCell align="center">roles</TableCell>
                  <TableCell align="center">end_status</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.list.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row">
                      {row.job_id}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.start_status}</TableCell>
                    <TableCell align="center">{row.operator}</TableCell>
                    <TableCell align="center">{typeof row.arg === 'object' ? JSON.stringify(row.arg) : row.arg}</TableCell>
                    {/* <TableCell align="center">详情</TableCell> */}
                    <TableCell align="center">
                      {row.roles.map((role) => (
                        <Chip size="small" label={role} />
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      {row.end_status.map((end) => (
                        <Chip size="small" label={end} />
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <Button color="primary" onClick={() => { Jobitemedit(row); }}>
                        编辑
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
          </Paper>
           {showEditJobItem
           && <JobItemEdit jobitem={job} closeEidtJobItem={() => { setShowEditJobItem(false); }} toFlash={(num) => { setFlushPage(num); }} />}
          {showNewJobItem
           && <JobItemNew closeNewJobItem={() => { setShowNewJobItem(false); }} toFlash={(num) => { setFlushPage(num); }} />}
        </div>
      </SnackbarProvider>
    );
  }
  return (
    <></>
  );
}


export default JobsItems;
