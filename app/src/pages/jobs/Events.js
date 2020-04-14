/* eslint-disable react/jsx-filename-extension */
import React from 'react';


import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ReactRouterPropTypes from 'react-router-prop-types';

import useFetch from '../../hooks/useFetch';


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
  button: {
    margin: theme.spacing(1),
  },
}));

function ListTitle(props) {
  const { extras } = props;
  return (
    <>
      {extras.toShow.map((item) => (
        <TableCell
          key={item[0]}
          margin="normal"
        >
          <Typography noWrap>

            {item[1]}
          </Typography>
        </TableCell>
      ))}
    </>
  );
}

function ListItem(props) {
  const { data: dataProp, extras } = props;
  console.log(extras.status_map);
  //  {Object.keys(dataProp).map((k) => (.includes(k) ? (
  return (
    <>
      {extras.toShow.map((item) => (
        item[0] !== 'status'
          ? (
            <TableCell
              key={item[0]}
              margin="normal"
            >
              <Typography noWrap={item[0]}>
                { item[0] !== 'create_at'
              && item[0] !== 'last_update_at'
                  ? dataProp[item[0]] : dataProp[item[0]].substring(5, 16)
            }
              </Typography>
            </TableCell>
          )
          : (
            <TableCell
              key={item[0]}
              margin="normal"
            >
              <Typography
                noWrap
                align="center"
                style={{ backgroundColor: (typeof(extras.status_map[dataProp[item[0]]]) != 'undefined'  ? extras.status_map[dataProp[item[0]]].bgcolor: 'white'), color:  (typeof(extras.status_map[dataProp[item[0]]]) != 'undefined' ? extras.status_map[dataProp[item[0]]].color: 'black') }}

              >
                { typeof(extras.status_map[dataProp[item[0]]]) !== 'undefined' ? extras.status_map[dataProp[item[0]]].name : '新任务' }
              </Typography>
            </TableCell>
          )
      ))}
    </>
  );
}

function GridItem(props) {
  const { data: dataProp, extras } = props;
  const toshow = [];
  extras.toShow.map((item) => {
    toshow.push(item[0]);
    return null;
  });
  return (
    <>
      {Object.keys(dataProp).map((k) => (
        toshow.includes(k) && (
        <Typography
          key={k}
          margin="normal"
        >
          { k !== 'create_at'
              && k !== 'last_update_at'
            ? dataProp[k] : dataProp[k].substring(5, 16)
            }
        </Typography>
        )

      ))
      }
    </>
  );
}

function ConfirmationDialogRaw(props) {
  const classes = useStyles();
  const {
    onClose, value: valueProp, open,
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


function App({ history, match, location }) {
  const page = match.params.page ? match.params.page : 0;
  const data = useFetch(`/api/jobs_events?page=${match.params.page}`, history);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Dione');

  function handleClose(newValue) {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  }

  const classes = useStyles();
  if (data.list !== undefined) {
    const hasNext = page < (Math.ceil(data.total/10) - 1)
    return (
      <>
        <Container
          className={classes.cardGrid}
          maxWidth="md"
        >
          <Hidden smDown>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <ListTitle data={data.list[0]} extras={data.extras} />
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.list.map((row) => (
                  <TableRow key={row.id}>
                    <ListItem data={row} extras={data.extras} />
                    <TableCell>
                      <IconButton
                        onClick={() => { history.push(`/i/event/${row.id}`); }}
                        size="small"
                        variant="contained"
                        aria-label="detail"
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Hidden>
          <Hidden mdUp>
            <Grid container spacing={4}>
              {data.list.map((card) => (
                <Grid item key={card.id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <GridItem data={card} extras={data.extras} />
                      <CardActions>
                        <IconButton
                          onClick={() => { history.push(`/i/event/${card.id}`); }}
                          size="small"
                          variant="contained"
                          aria-label="detail"
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </CardActions>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Hidden>
          <div style={{ display: 'flex' }}>
            <Typography style={{ flexGrow: 1 }} />
            <Button
              size="small"
              variant="contained"
              color={parseInt(page) > 0 ? 'primary' : 'disable'}
              disable={ parseInt(page) > 0 }
              className={classes.button}
              onClick={() => { parseInt(page) > 0 && history.push(`/i/events/${parseInt(page) - 1}`); }}
            >
      上一页
            </Button>
            <Button
              size="small"
              variant="contained"
              disable={ hasNext }
              color={ hasNext ? 'primary' : 'disable'}
              className={classes.button}
              onClick={() => { hasNext && history.push(`/i/events/${parseInt(page) + 1}`); }}
            >
      下一页
            </Button>
          </div>
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

App.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

ListItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

ListTitle.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

GridItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default App;
