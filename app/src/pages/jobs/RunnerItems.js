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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
  margin: {
    marginTop: theme.spacing(1),
  },
  formtop: {
    marginTop: theme.spacing(2),
  },
  input: {
    margin: theme.spacing(1),
  },
}));

function RunnerItemNew(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { actuator, closeNewRunnerItem, toFlash } = props;
  const [other, setOther] = React.useState({});
  const handleChange = (name) => (event) => {
    setOther({ ...other, [name]: event.target.value });
  };
  function doNew() {
    fetch('/api/runner_items', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ other }), // data can be `string` or {object}!
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
          enqueueSnackbar('runner_item新增成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeNewRunnerItem();
    toFlash(Date.now());
  }

  return (
    <>
      <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeNewRunnerItem}>
        <DialogTitle id="form-dialog-title">新建RunnerItem</DialogTitle>
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
            onChange={handleChange('title')}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="demo-customized-select-native">
              执行器
            </InputLabel>
            <NativeSelect
              value={other.runner}
              onChange={handleChange('runner')}
              inputProps={{ name: 'content' }}
            >
              <option value="" />
              {actuator.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormControl fullWidth>
            <FormLabel component="legend" className={classes.formtop}>Content</FormLabel>
            <CodeMirror
              className={classes.margin}
              value={other.content}
              options={{
                lineWrapping: true,
                mode: 'javascript',
                theme: 'material',
              }}
              onBeforeChange={(editor, data, value) => {
                setOther({ ...other, content: value });
              }}
            />
          </FormControl>
          <TextField
            autoFocus
            required
            margin="normal"
            variant="outlined"
            id="result_mapper"
            label="result_mapper"
            name="result_mapper"
            onChange={handleChange('result_mapper')}
            fullWidth
          />
          <FormControl>
            <FormLabel component="legend" className={classes.formtop}>Async</FormLabel>
            <RadioGroup aria-label="async" name="async" value={other.async} onChange={handleChange('async')} row>
              <FormControlLabel
                value="True"
                control={<Radio color="primary" />}
                label="是"
                labelPlacement="start"
              />
              <FormControlLabel
                value="False"
                control={<Radio color="primary" />}
                label="否"
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeNewRunnerItem} className={classes.button}>
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

function RunnerItemEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { runneritem, actuator, closeEditRunnerItem, toFlash } = props;
  const [other, setOther] = React.useState({});
  const [asyncO, setAsyncO] = React.useState(runneritem.async === true ? 'True' : 'False');
  const handleChange = (name) => (event) => {
    setOther({ ...other, [name]: event.target.value });
  };
  useEffect(() => {
    if (runneritem !== undefined) {
      setOther({ ...other, runner: runneritem.runner, content: runneritem.content, async: asyncO });
    }
  }, [runneritem]);
  function doEdit() {
    fetch(`/api/runner_items/${runneritem.id}`, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({ other }), // data can be `string` or {object}!
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
          enqueueSnackbar('runner_item修改成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeEditRunnerItem();
    toFlash(Date.now());
  }

  return (
    <>
    <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeEditRunnerItem}>
      <DialogTitle id="form-dialog-title">编辑RunnerItem</DialogTitle>
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
          onChange={handleChange('title')}
          defaultValue={runneritem.title}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel htmlFor="demo-customized-select-native">
            执行器
          </InputLabel>
          <NativeSelect
            value={other.runner}
            onChange={handleChange('runner')}
            inputProps={{ name: 'content' }}
          >
            <option value="" />
            {actuator.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </NativeSelect>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel component="legend" className={classes.formtop}>Content</FormLabel>
          <CodeMirror
            className={classes.margin}
            value={other.content}
            options={{
              lineWrapping: true,
              mode: 'javascript',
              theme: 'material',
            }}
            onBeforeChange={(editor, data, value) => {
              setOther({ ...other, content: value });
            }}
          />
        </FormControl>
        <TextField
          autoFocus
          required
          margin="normal"
          variant="outlined"
          id="result_mapper"
          label="result_mapper"
          name="result_mapper"
          onChange={handleChange('result_mapper')}
          defaultValue={runneritem.result_mapper}
          fullWidth
        />
        <FormControl>
          <FormLabel component="legend" className={classes.formtop}>Async</FormLabel>
          <RadioGroup aria-label="async" name="async" value={other.async} onChange={handleChange('async')} row>
            <FormControlLabel
              value="True"
              control={<Radio color="primary" />}
              label="是"
              labelPlacement="start"
            />
            <FormControlLabel
              value="False"
              control={<Radio color="primary" />}
              label="否"
              labelPlacement="start"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={closeEditRunnerItem} className={classes.button}>
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

function RunnerItems() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showEditRunnerItem, setShowEditRunnerItem] = React.useState(false);
  const [showNewRunnerItem, setShowNewRunnerItem] = React.useState(false);
  const [searchId, setSearchId] = React.useState('');
  const [getID, setGetId] = React.useState('');
  const [flushPage, setFlushPage] = React.useState();
  const data = useFetch(`/api/runner_items?page=${page}&pagesize=${rowsPerPage}&id=${searchId}&sort=-id`, flushPage);
  const [runnerItem, setRunnerItem] = React.useState('');

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
  }
  function Runneritemedit(props) {
    setRunnerItem(props);
    setShowEditRunnerItem(true);
  }
  function Runneritemnew() {
    setShowNewRunnerItem(true);
  }

  if (data.list !== undefined) {
    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <div>
          <Grid container spacing={1}>
            <Grid item spacing={1}>
              <CssTextField
                autoFocus
                margin="normal"
                variant="outlined"
                id="search_id"
                label="ID"
                name="search_id"
                className={classes.input}
                onChange={handleChangeSearch('search_id')}
              />
              <Button variant="contained" color="primary" onClick={() => { doSearch(); }} className={classes.button}>
                搜索
              </Button>
            </Grid>
            <Grid item spacing={1}>
              <Button variant="contained" color="primary" onClick={() => { Runneritemnew(); }} className={classes.button}>
                新建Runner_Items
              </Button>
            </Grid>
          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">name</TableCell>
                  <TableCell align="center">执行器</TableCell>
                  <TableCell align="center">命令</TableCell>
                  <TableCell align="center">result_mapper</TableCell>
                  <TableCell align="center">async</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.list.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.title}</TableCell>
                    <TableCell align="center">{row.runner}</TableCell>
                    <TableCell align="center">{row.content}</TableCell>
                    <TableCell align="center">{row.result_mapper}</TableCell>
                    {/* <TableCell align="center">{row.async}</TableCell> */}
                    <TableCell align="center">{row.async && true ? '是' : '否'}</TableCell>
                    <TableCell align="center">
                      <Button color="primary" onClick={() => { Runneritemedit(row); }}>
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
           {showEditRunnerItem
           && <RunnerItemEdit runneritem={runnerItem} actuator={data.extras.actuator} closeEditRunnerItem={() => { setShowEditRunnerItem(false); }} toFlash={(num) => { setFlushPage(num); }} />}
          {showNewRunnerItem
          && <RunnerItemNew actuator={data.extras.actuator} closeNewRunnerItem={() => { setShowNewRunnerItem(false); }} toFlash={(num) => { setFlushPage(num); }} />}
        </div>
      </SnackbarProvider>
    );
  }
  return (
    <></>
  );
}

export default RunnerItems;
