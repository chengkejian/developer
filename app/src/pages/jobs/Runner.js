import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Chip from '@material-ui/core/Chip';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
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
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { SnackbarProvider, useSnackbar } from 'notistack';
import useFetch from '../../hooks/useFetch';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  rootgrid: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 250,
    height: 500,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  table: {
    minWidth: 500,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  buttoncustom: {
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

function RunnerNew(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { closeNewRunner, toFlash } = props;
  const roles = useFetch('/api/roles?sort=-id');
  const [state, setState] = React.useState({});
  const [name, setName] = React.useState({});
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };
  const handleChangeName = event => {
    setName(event.target.value);
  };
  function doNew() {
    const url = '/api/runner';
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ name: name, roles: state }), // data can be `string` or {object}!
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
          enqueueSnackbar('执行器添加成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeNewRunner();
    toFlash(Date.now());
  }
  if (roles.list !== undefined) {
    return (
      <>
      <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeNewRunner}>
        <DialogTitle>新增执行器</DialogTitle>
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
            onChange={handleChangeName}
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
          <Button variant="contained" onClick={closeNewRunner} className={classes.buttoncustom}>
            取消
          </Button>
          <Button variant="contained" onClick={() => { doNew(); }} color="primary" className={classes.buttoncustom}>
            提交
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }
  return null;
}

function RunnerEdit(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { runner, closeEidtRunner, toFlash } = props;
  const roles = useFetch('/api/roles?sort=-id');
  const [state, setState] = React.useState({});
  const [name, setName] = React.useState({});
  const jobRoleStatus = {};
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };
  const handleChangeName = event => {
    setName(event.target.value);
  };
  useEffect(() => {
    if (runner !== undefined && roles.list !== undefined) {
      roles.list.map((role) => (
        jobRoleStatus[role.id] = isInArray(role.role_desc, runner.permission)
      ));
      setState(jobRoleStatus);
      setName(runner.name);
    }
  }, [roles]);
  function doEdit() {
    const url = `/api/runner/${runner.id}`;
    fetch(url, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({ name: name, roles: state }), // data can be `string` or {object}!
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
          enqueueSnackbar('执行器修改成功', { variant: 'success', autoHideDuration: 3000 });
        }
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    closeEidtRunner();
    toFlash(Date.now());
  }
  if (runner !== undefined && roles.list !== undefined) {
    return (
      <>
      <Dialog open="true" fullWidth="true" maxWidth="xs" onClose={closeEidtRunner}>
        <DialogTitle>编辑执行器</DialogTitle>
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
            onChange={handleChangeName}
            defaultValue={runner.name}
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
          <Button variant="contained" onClick={closeEidtRunner} className={classes.buttoncustom}>
            取消
          </Button>
          <Button variant="contained" onClick={() => { doEdit(); }} color="primary" className={classes.buttoncustom}>
            提交
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }
  return null;
}

function TransferList(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { runnerId, runnerItems, runnerItemsHad, toFlash } = props;
  const [leftChecked, setLeftChecked] = React.useState([]);
  const [rightChecked, setRightChecked] = React.useState({});
  const [right, setRight] = React.useState([]);
  useEffect(() => {
    if (runnerItemsHad !== undefined && runnerItemsHad !== null) {
      const data = [];
      runnerItemsHad.map(runnerItem => (
        runnerItems.map((value) => (
          runnerItem === value.id && data.push(value)
        ))
      ));
      setRight(data);
    } else {
      setRight([]);
    }
  }, [runnerItemsHad]);
  const numberOfChecked = (title, checked) => {
    const num = title === '所有命令' ? checked.length : Object.keys(checked).length;
    return num;
  };
  const handleToggle = (title, value, index) => {
    if (title === '所有命令') {
      const newLeftChecked = [...leftChecked];
      newLeftChecked.indexOf(value) === -1 ? newLeftChecked.push(value) : newLeftChecked.splice(newLeftChecked.indexOf(value), 1);
      setLeftChecked(newLeftChecked);
    } else {
      const newRightChecked = { ...rightChecked };
      newRightChecked[index] === undefined ? newRightChecked[index] = value : delete newRightChecked[index];
      setRightChecked(newRightChecked);
    }
  };
  const handleToggleAll = (title, items) => {
    if (title === '所有命令') {
      const newLeftChecked = [];
      items.map((value) => (
        newLeftChecked.push(value.id)
      ));
      numberOfChecked(title, leftChecked) === items.length ? setLeftChecked([]) : setLeftChecked(newLeftChecked);
    } else {
      if (numberOfChecked(title, rightChecked) !== items.length) {
        const newRightChecked = {};
        items.map((value, index) => (
          newRightChecked[index] = value
        ));
        setRightChecked(newRightChecked);
      } else {
        setRightChecked({});
      }
    }
  };
  function doEidt(data) {
    const url = `/api/runner/${runnerId}`;
    fetch(url, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({ runner_items: data }), // data can be `string` or {object}!
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
        if (response.return_code === '1111') {
          enqueueSnackbar(response.data, { variant: 'warning', autoHideDuration: 3000 });
        }
      });
    toFlash(Date.now());
  }
  function handleChecked(action) {
    if (action === 'add') {
      const data = [...right];
      leftChecked.map(checked => (
        runnerItems.map(value => (
          checked === value.id && data.push(value)
        ))
      ));
      setRight(data);
      doEidt(data);
      setLeftChecked([]);
    } else {
      const data = [...right];
      const newChecked = [];
      for (let i = Object.keys(rightChecked).length - 1; i >= 0; i--) {
        newChecked.push(Number(Object.keys(rightChecked)[i]));
      }
      newChecked.map(value => (
        data.splice(value, 1)
      ));
      doEidt(data);
      setRight(data);
      setRightChecked({});
    }
  }

  const customList = (title, items, checked) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={() => { handleToggleAll(title, items); }}
            checked={numberOfChecked(title, checked) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(title, checked) !== items.length && numberOfChecked(title, checked) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(title, checked)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value, index) => (
            <ListItem key={index} role="listitem" button onClick={() => { handleToggle(title, value.id, index); }}>
              <ListItemIcon>
                <Checkbox
                  checked={title === '所有命令' ? checked.indexOf(value.id) !== -1 : checked[index] !== undefined}
                  tabIndex={-1}
                  disableRipple
                  // inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={value.id} primary={`${value.id}.${value.title}`} />
            </ListItem>
        ))}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.rootgrid}>
      <Grid item>{customList('所有命令', runnerItems, leftChecked)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => { handleChecked('add'); }}
            disabled={runnerId === 0 || leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => {handleChecked('del'); }}
            disabled={runnerId === 0 || Object.keys(rightChecked).length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('已有命令', right, rightChecked)}</Grid>
    </Grid>
  );
}




function Runner() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [flushPage, setFlushPage] = React.useState();
  const [showEditRunner, setShwoEditRunner] = React.useState(false);
  const [showNewRunner, setShwoNewRunner] = React.useState(false);
  const data = useFetch(`/api/runner?page=${page}&pagesize=${rowsPerPage}&sort=-id`, flushPage);
  const runnerItems = useFetch('/api/runner_items?page=False&sort=-id&field=id,title');
  const [runnerItemsHad, setRunnerItemsHad] = React.useState();
  const [state, setState] = React.useState({});
  const [runner, setRunner] = React.useState('');
  const [runnerId, setRunnerId] = React.useState(0);
  const runnerStatus = {};
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
    const data_to_submit = {type: event.target.checked };
    fetch(`/api/runner/${name}`, {
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
  function Runneredit(props) {
    setRunner(props);
    setShwoEditRunner(true);
  }
  function Runnernew() {
    setShwoNewRunner(true);
  }
  function RunnerItemsHad(id, runner_items) {
    setRunnerId(id);
    setRunnerItemsHad(runner_items);
  }

  useEffect(() => {
    if (data.list !== undefined) {
      data.list.map((runnerList) => (
        runnerStatus[runnerList.id] = runnerList.type === 'single'
      ));
      setState(runnerStatus);
    }
  }, [data]);

  if (data.list !== undefined && Object.keys(state).length === data.list.length) {
    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => { Runnernew(); }} className={classes.button}>
          新建执行器
        </Button>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="center">name</TableCell>
                  <TableCell align="center">对外</TableCell>
                  <TableCell align="center">权限</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.list.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">
                      <Link component="button" onClick={() => { RunnerItemsHad(row.id, row.runner_items); }}>{row.name}</Link>
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        color="primary"
                        checked={state[row.id]}
                        onChange={handleChange(row.id)}
                        value={row.id}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {row.permission.map((role) => (
                        <Chip size="small" label={role} />
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="contained" size="small" color="primary" onClick={() => { Runneredit(row); }}>
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
        </Grid>
        <Grid item xs={6}>
          <TransferList runnerId={runnerId} runnerItems={runnerItems.list} runnerItemsHad={runnerItemsHad} toFlash={(num) => { setFlushPage(num); }} />
        </Grid>
      </Grid>
    {showEditRunner
    && <RunnerEdit runner={runner} closeEidtRunner={() => { setShwoEditRunner(false); }} toFlash={(num) => { setFlushPage(num); }} />}
    {showNewRunner
    && <RunnerNew closeNewRunner={() => { setShwoNewRunner(false); }} toFlash={(num) => { setFlushPage(num); }} />}
  </SnackbarProvider>
    );
  }
  return null;
}


export default Runner;
