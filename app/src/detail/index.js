import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useFetch from '../hooks';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
  },
  pre: {
    textAlign: 'left',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
}));

function Types({ match, history }) {
  const classes = useStyles();
  const data = useFetch(`/api/${match.params.item}/${match.params.id}`, '');
  console.log('XXXXXXXXXXXXXXX');
  //  console.log(props);
  console.log(data);
  const dat = data.data ? data.data : {};

  return (
    <div>
      <Button
        onClick={history.goBack}
        variant="contained"
        className={classes.button}
      >
    返回
    </Button>
    <Paper className={classes.root}>
    <Table className={classes.table}>
    <TableBody>
    {Object.keys(dat).map(k => (
      <TableRow key={k}>
      <TableCell component="th" scope="row">
      {k}
      </TableCell>
      <TableCell><span className={classes.pre}>{dat[k]}</span></TableCell>
      </TableRow>
    ))}
    </TableBody>
    </Table>
    </Paper>
    </div>
  );
}
export default Types;
// export default withRouter(Types);
