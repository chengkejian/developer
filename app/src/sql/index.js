import React from 'react';


import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import useFetch from '../hooks';

function ConfirmationDialogRaw(props) {
  const classes = useStyles();
  const {
    onClose, value: valueProp, open, ...other
  } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    setValue(valueProp);
  }, [valueProp, open]);

  function handleEntering() {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  }

  function handleOk() {
    if (value !== 'Loading') {
      onClose(value);
    }
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">输出</DialogTitle>
      <DialogContent dividers>
        <pre className={classes.pre}>
          {value}
        </pre>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleOk}
          color="primary"
          disabled={value === 'Loading'}
        >
    Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  button: {
    margin: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  pre: {
    textAlign: 'left',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  success: {
    backgroundColor: 'green',
    color: 'white',
  },
  failed: {
    backgroundColor: 'red',
    color: 'white',
  },
  todo: {
    backgroundColor: 'yellow',
  },
  margin: {
    margin: '3px',
  },
}));

function SQL(props) {
  console.log(props.match.params.page);
  const page = props.match.params.page ? props.match.params.page : 0;
  const [open, setOpen] = React.useState(false);
  const data = useFetch(`/api/sqls?page=${page}`, open);
  const [value, setValue] = React.useState('Dione');
  function handleClickListItem(action, env) {
    console.log(action);
    setOpen(true);
    setValue('Loading');
    async function getData() {
      const response = await fetch(`/api/sql_exec?op=${action}&env=${env}`);
      if (response.status === '401') {
        props.history.push('/login');
      } else {
        const data = await response.json();
        console.log(data.data);
        setValue(JSON.stringify(data.data));
        // setRunning(false);
      }
    }
    getData();
  }

  function actionDo(action, id) {
    const data = { action };
    fetch(`/api/sqls/${id}`, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json())
      .catch((error) => {
        console.error('Error:', error);
        setOpen(true);
        setValue('出错了');
      })
      .then((response) => {
        console.log('Success:', response);
        setOpen(true);
        setValue(response.data);
      });
  }

  function handleClose(newValue) {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  }
  console.log(data);
  const classes = useStyles();
  if (data.data !== undefined) {
    return (
      <>
        <Container
          className={classes.cardGrid}
          maxWidth="md"
        >
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">描述</TableCell>
                <TableCell align="center">申请人</TableCell>
                <TableCell align="center">状态</TableCell>
                <TableCell align="center">创建时间</TableCell>
                <TableCell align="center">环境</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.list.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" title={row.sql}>
                    <Typography>
                      {row.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>
                      {row.user}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap className={classes[row.status_code]} align="center">
                      {row.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>
                      {row.create_at.substring(5, 16)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>
                      {row.env}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="default"
                      variant="contained"
                      className={classes.margin}
                      onClick={() => handleClickListItem(row.id, 'pre')}
                    >
        执行
                    </Button>
                    <Button
                      size="small"
                      color="default"
                      variant="contained"
                      className={classes.margin}
                      onClick={() => props.history.push(`/i/sqls/${row.id}/detail`)}
                    >
        详情
                    </Button>
                    <Button
                      size="small"
                      color="default"
                      variant="contained"
                      className={classes.margin}
                      onClick={() => props.history.push(`/i/sqls/${row.id}/edit`)}
                    >
        编辑
                    </Button>
                    <Button
                      size="small"
                      color="default"
                      variant="contained"
                      className={classes.margin}
                      onClick={() => actionDo('reject', row.id)}
                    >
        驳回
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* End hero unit
      <Grid container spacing={4}>
      {data.data.list.map(card => (
        <Grid item key={card.id} xs={12} sm={6} md={4}>
        <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
        <Typography
        gutterBottom
        variant="h5"
        component="h2">
        {card.title}
        </Typography>
        <Typography>
        {card.sql}
        </Typography>
        <Typography>
        <br />
        <br />
        提交人: {card.user}
        <br />
        执行于: {card.status}
        </Typography>
        </CardContent>
        <CardActions>
        <Button size="small" color="primary"
        onClick={() => handleClickListItem(card.id, 'prd')}>
        生产环境
        </Button>
        <Button size="small" color="primary"
        onClick={() => handleClickListItem(card.id, 'pre')}>
        预发布环境
        </Button>
        </CardActions>
        </Card>
        </Grid>
      ))}
      </Grid>
        */}
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => { props.history.push(`/i/sql/${parseInt(page) - 1}`); }}
          >
      上一页
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => { props.history.push(`/i/sql/${parseInt(page) + 1}`); }}
          >
      下一页
          </Button>
        </Container>
        <ConfirmationDialogRaw
          classes={{
            paper: classes.paper,
          }}
          id="ringtone-menu"
          keepMounted
          open={open}
          value={value}
          onClose={handleClose}
        />

        {/* End footer */}
      </>
    );
  }
  return (
    <></>
  );
}
export default SQL;
