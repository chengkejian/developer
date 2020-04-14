import React from 'react';


import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import useFetch from '../hooks';


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
}));

function Album(props) {
  const data = useFetch('/api/resource', props.history);
  console.log(data);
  const classes = useStyles();
  if (data.data !== undefined && data.return_code !== '1111') {
    return (
      <>
        <Container
          className={classes.cardGrid}
          maxWidth="md"
        >
          {/* End hero unit */}
          <Grid container spacing={4}>
            {data.data.list.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      noWrap
                      component="h5"
                    >
                      {card.title}
                    </Typography>
                    <Typography style={{ height: '40px' }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <a href={card.url}>
                      <Button size="small" color="primary">
                      访问
                      </Button>
                    </a>
                    <a href={card.doc_url}>
                      <Button size="small" color="primary">
                      文档
                      </Button>
                    </a>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* End footer */}
      </>
    );
  }
  return (
    <></>
  );
}
export default Album;
