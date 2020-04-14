import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import useFetch from '../hooks';


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
  paper: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
}));

function Types({ match, history }) {
  const [values, setValues] = React.useState({ });
  const classes = useStyles();
  const data = useFetch(`/api/${match.params.item}/${match.params.id}`, '');
  React.useEffect(() => {
    if (data.data) {
      const newData = {};
      Object.keys(data.data).map((key) => {
        const value = data.data[key];
        if (value) {
          newData[key] = value;
        }
        return value;
      });
      setValues(newData);
      // setValues(data.data)
    }
  }, [data.data]);
  //  console.log(props);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  function save() {
    fetch(`/api/${match.params.item}/${match.params.id}`, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(values), // data can be `string` or {object}!
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
        alert(response.data);
      });
  }
  function copy() {
    const new_values = JSON.parse(JSON.stringify(values));
    delete (new_values.create_at);
    delete (new_values.status);
    delete (new_values.uid);
    delete (new_values.id);
    fetch(`/api/${match.params.item}`, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(new_values), // data can be `string` or {object}!
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
        alert(response.data);
      });
  }

  if (data.data) {
    return (
      <div>
        <Button onClick={history.goBack} variant="contained" className={classes.button}>
      返回
        </Button>
        <Button onClick={save} variant="contained" className={classes.button}>
      保存
        </Button>
        <Button onClick={copy} variant="contained" className={classes.button}>
     另存/复制
        </Button>
        <Paper className={classes.paper}>
          {Object.keys(data.data).map((k) => (
            <TextField
              id="standard-name"
              key={k}
              label={k}
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              value={values[k]}
              fullWidth
              multiline
              onChange={handleChange(k)}
              margin="normal"
            />
          ))}
        </Paper>
      </div>
    );
  }
  return (
    <div />
  );
}
export default Types;
// export default withRouter(Types);
