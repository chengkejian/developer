import React from 'react';


import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

import useFetch from '../hooks';

function ListItem(props) {
  const { data: dataProp, ...other } = props;
  console.log(other);
  return (
    <>
      {Object.keys(dataProp).map((k) => (
        <TableCell
          key={k}
          margin="normal"
        >
          {dataProp[k]}
        </TableCell>
      ))}
    </>
  );
}
function GridItem(props) {
  const { data: dataProp, ...other } = props;
  console.log(other);
  return (
    <>
      {Object.keys(dataProp).map((k) => {
        if (k !== 'actions') {
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
            <Button size="small" color="primary">
                      访问
            </Button>
          </CardActions>
        );
      })}
    </>
  );
}

function ListTitle(props) {
  const { data: dataProp, ...other } = props;
  console.log(other);
  return (
    <>
      {Object.keys(dataProp).map((k) => (
        <TableCell
          key={k}
          margin="normal"
        >
          {k}
        </TableCell>
      ))}
    </>
  );
}
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
    fab: {
          position: 'absolute',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        },
}));

function SQL(props) {
  const params = new URLSearchParams(props.location.search);
  console.log(props.match.params.page);
  const data = useFetch(`/api/${props.match.params.table}?page=${props.match.params.page}`, props.history);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Dione');

  function handleClose(newValue) {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  }

  console.log(data);
  const classes = useStyles();
  if (data.data !== undefined) {
    if (params.get('display') === 'grid') {
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
    else {
      return (
        <>
          <Container
            className={classes.cardGrid}
            maxWidth="md"
          >
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <ListTitle data={data.data.list[0]} />
                  <TableCell>action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.list.map((row) => (

                  <TableRow key={row.id}>
                    <ListItem data={row} />
                    <TableCell>

                      <Link component={RouterLink} to={`/i/${props.match.params.table}/${row.id}/edit`}>Edit</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        <Fab aria-label='Add' className={classes.fab} color='primary'>
              <AddIcon />
        </Fab>
        </>
      );
    }
  }
  return (
    <></>
  );
}
export default SQL;
