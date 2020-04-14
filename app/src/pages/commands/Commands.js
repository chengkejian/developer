/* eslint-disable react/jsx-filename-extension */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
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
  button: {
    marginLeft: 'auto',
  },
  grow: {
    flexGrow: 1,
  },
  pre: {
    textAlign: 'left',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
}));

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
      maxWidth={false}
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
          className={classes.button}
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

function Commands({ history, ...props }) {
  const data = useFetch('/api/executer', history);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Dione');
  function handleClickListItem(action) {
    setOpen(true);
    setValue('Loading');
    async function getData() {
      const response = await fetch(`/api/exe/${action}`);
      if (response.status === 401) {
        props.history.push('/login');
      } else {
        const resp = await response.json();
        if (resp.data) {
          setValue(resp.data.message);
        } else {
          setValue('执行错误');
        }
        // setRunning(false);
      }
    }
    getData();
  }

  function handleClose(newValue) {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  }

  const classes = useStyles();
  if (data.list !== undefined) {
    return (
      <>
        <Container
          className={classes.cardGrid}
          maxWidth="md"
        >
          {/* End hero unit */}
          <Grid container spacing={4}>
            {data.list.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography
                      gutterBottom
                      noWrap
                    >
                      {card.name}
                    </Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Typography className={classes.grow} />
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleClickListItem(card.id)}
                    >
                      执行
                    </Button>
                  </CardActions>
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

        {/* End footer */}
      </>
    );
  }
  return (
    <></>
  );
}

Commands.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
};

export default Commands;
