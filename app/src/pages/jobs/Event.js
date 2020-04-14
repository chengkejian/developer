/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import useFetch from '../../hooks';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(1),
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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  action: {
    margin: theme.spacing(1),
  },
  pre: {
    textAlign: 'left',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
}));

function GridItem(props) {
  const classes = useStyles();
  const { data: dataProp, ...other } = props;
  console.log(other);
  return (
    <>
      {Object.keys(dataProp).map((k) => {
        if (k !== 'action' || k !== 'events') {
          return (
            <Typography
              key={k}
              margin="normal"
            >
              {dataProp[k]}
            </Typography>
          );
        }
        return (
          <CardActions>
            <Button
              size="small"
              variant="contained"
              color="primary"
              className={classes.button}
            >
                访问
            </Button>
          </CardActions>
        );
      })}
    </>
  );
}

function ConfirmationDialogRaw(props) {
  const classes = useStyles();
  const {
    onClose, value: valueProp, open,
  } = props;
  const [value, setValue] = React.useState('');
  const [title, setTitle] = React.useState('');
  const radioGroupRef = React.useRef(null);
  React.useEffect(() => {
    if (valueProp.error !== undefined || valueProp.message !== undefined) {
      const job_events = [];
      if (valueProp.error !== undefined) {
        setTitle('请注意，执行出错');
        valueProp.error === '出错了' ? job_events.push({'程序执行出错，请查看程序日志': []}) : job_events.push({[valueProp.error[Object.keys(valueProp.error)][0]]: valueProp.error[Object.keys(valueProp.error)][1]});
      } else {
        setTitle('输出');
        valueProp.message.map((job_event) => (
          job_events.push({[Object.values(job_event)[0][0]]: Object.values(job_event)[0][1]})
        ));
      }
      setValue(job_events);
    }
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

  if (value !== '') {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        onEntering={handleEntering}
        aria-labelledby="confirmation-dialog-title"
        open={open}
      >
        <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
        <DialogContent dividers>
          {value.map((job) => (
            <div>
            <Typography variant="h6" gutterBottom>
              {Object.keys(job)[0]}:
            </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {Object.values(job)[0][1]}
              </Typography>
              <Divider />
            </div>
          ))}
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
  return null;
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};


function SQL(props) {
  const [open, setOpen] = React.useState(false);
  const [disbotton, setDisbotton] = React.useState(false);
  const data = useFetch(`/api/jobs_events/${props.match.params.id}`, disbotton);
  //  console.log(props);
  console.log(data);
  const dat = data.data ? data.data : {};
  const [value, setValue] = React.useState({});

  function actionDo(action_id, operator, job_id) {
    if (operator === 'edit') {
      props.history.push(`/i/create_job/${job_id}/${props.match.params.id}`);
    } else if (operator === 'create_content') {
      props.history.push(`/i/create_job/${action_id}/?event_id=${props.match.params.id}`);
    } else {
      setDisbotton(true);
      const data = { action_id };
      fetch(`/api/jobs_events/${props.match.params.id}`, {
        method: 'PUT', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then((res) => {
        if (res.ok) {
          return res.json();
        }
        console.error('Error:');
        setOpen(true);
        setValue({ ...value, error: '出错了' });
        setDisbotton(false);
      })
        .catch((error) => {
          console.error('Error:', error);
          setOpen(true);
          setValue({ ...value, error: '出错了' });
          setDisbotton(false);
        })
        .then((response) => {
          console.log('Success:', response);
          if (response !== undefined) {
            if (response.data !== 'OK') {
              setOpen(true);
              response.return_msg !== null ? setValue({...value, error: response.return_msg}) : setValue({
                ...value,
                message: response.data.list
              });
            }
          }
          setDisbotton(false);
        });
    }
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
    if (1) {
      return (
        <>
          <Container
            className={classes.cardGrid}
            maxWidth="md"
          >
            <Button
              onClick={props.history.goBack}
              variant="contained"
              className={classes.button}
            >
              返回
            </Button>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableBody>
                  {Object.keys(dat).map((k) => {
                    if (k !== 'actions' && k !== 'events') {
                      return (
                        <TableRow key={k}>
                          <TableCell component="th" scope="row">
                            {k}
                          </TableCell>
                          <TableCell>{typeof dat[k] === 'object' ? JSON.stringify(dat[k]) : dat[k]}</TableCell>
                        </TableRow>
                      );
                    }
                    return (<div />);
                  })}
                </TableBody>
              </Table>
            </Paper>
            {dat.events.map((sub_data) => (

              <Paper className={classes.root}>

                <Table className={classes.table}>
                  <TableBody>
                    {Object.keys(sub_data).map((k) => {
                      if (k !== 'actions' && k !== 'events') {
                        return (
                          <TableRow key={k}>
                            <TableCell component="th" scope="row">
                              {k}
                            </TableCell>
                            <TableCell>{typeof sub_data[k] === 'object' ? JSON.stringify(sub_data[k]) : sub_data[k]}</TableCell>
                          </TableRow>
                        );
                      }
                      return (<div />);
                    })}
                  </TableBody>
                </Table>

              </Paper>
            ))}
            <Paper className={classes.root}>
              {dat.actions.map((d) => (
                <Button
                  onClick={() => actionDo(d.id, d.operator, d.arguments)}
                  disabled={disbotton}
                  variant="contained"
                  color="primary"
                  className={classes.action}
                >
                  {d.name}
                </Button>
              ))}
            </Paper>
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
        </>
      );
    }
    return (
      <>
        <Container
          className={classes.cardGrid}
          maxWidth="md"
        >
          <Grid container spacing={4}>
            {data.data.list.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <GridItem data={card} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
      </>
    );
  }
  return (
    <></>
  );
}
export default SQL;
