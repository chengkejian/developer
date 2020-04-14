import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
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
  formControl: {
    margin: theme.spacing(0),
    minWidth: 180,
  },
}));

function ParserDate(date) {
  if (date !== null) {
    const d = new Date(date);
    // const resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    const resDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return resDate;
  }
  return null;
}

function CronLog() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchName, setSearchName] = React.useState('');
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState({
    startDate: null,
    endDate: null,
  });
  const [order, setOrder] = React.useState('create_at');
  const data = useFetch(`/api/cron_log?page=${page}&pagesize=${rowsPerPage}&name=${searchName}&create_at=${JSON.stringify(date)}&sort=${order}`);
  const cronname = useFetch('/api/cron?sort=-id');
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleSort = (props) => {
    setOrder(props === 'create_at' ? '-create_at' : 'create_at');
  };
  function doSearch() {
    setSearchName(name);
    setDate(selectedDate);
    setPage(0);
  }
  if (data.list !== undefined && cronname.list !== undefined) {
    return (
      <div>
        <Grid container spacing={1}>
          <Grid item spacing={1}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">
                Cron选择
              </InputLabel>
              <Select
                id="cron_name"
                value={name}
                onChange={handleChangeName}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {cronname.list.map((cron) => (
                  <MenuItem value={cron.name}>
                    {cron.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item spacing={1}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                clearable
                value={selectedDate.startDate}
                placeholder="0000-0-0"
                onChange={(date) => setSelectedDate({ ...selectedDate, startDate: ParserDate(date) })}
                format="yyyy-MM-dd"
                maxDate={selectedDate.endDate}
              />
              到
              <KeyboardDatePicker
                clearable
                placeholder="0000-0-0"
                value={selectedDate.endDate}
                onChange={(date) => setSelectedDate({ ...selectedDate, endDate: ParserDate(date) })}
                format="yyyy-MM-dd"
                minDate={selectedDate.startDate}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item spacing={1}>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => { doSearch(); }}>
              搜索
            </Button>
          </Grid>
        </Grid>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">name</TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active
                    direction={order === 'create_at' ? 'desc' : 'asc'}
                    onClick={() => { handleSort(order); }}
                  >
                  执行时间
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">状态</TableCell>
                <TableCell align="center">执行结果</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.list.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.create_at}</TableCell>
                  <TableCell align="center">
                    <Box color={row.status === 'fail' ? 'error.main' : 'text.primary'}>{row.status}</Box>
                  </TableCell>
                  <TableCell align="center">{row.resutl}</TableCell>
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
      </div>
    );
  }
  return (
    <></>
  );
}

export default CronLog;
