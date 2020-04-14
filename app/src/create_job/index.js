import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import NativeSelect from '@material-ui/core/NativeSelect';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Controlled as CodeMirror } from 'react-codemirror2';
import useFetch from '../hooks';

require('codemirror/mode/sql/sql');
require('codemirror/mode/python/python');
require('codemirror/mode/shell/shell');
require('codemirror/mode/javascript/javascript');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');


const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginButtom: theme.spacing(1),
  },
  pre: {
    textAlign: 'left',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
}));


function JobItem(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [radio, setRadio] = React.useState('0');
  const [select, setSelect] = React.useState('');
  const [selectM, setSelectM] = React.useState('');
  const [selectS, setSelectS] = React.useState('');
  const [m, setM] = React.useState([]);
  const { onChange, data, originD: propValue } = props;
  useEffect(() => {
    setRadio(propValue);
    // setValue('propValue[data.value]');
    setValue(propValue);
    onChange(propValue);
  },
    // eslint-disable-next-line
  [propValue]);


  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  const handleRadio = (event) => {
    setRadio(event.target.value);
    onChange(event.target.value);
  };
  const handleSelect = (event) => {
    setSelect(event.target.value);
    onChange(event.target.value);
  };
  const handleSelectController = (event) => {
    setSelectM(event.target.value);
    setSelectS('');
    setM([]);
    const p = event.target.value;
    async function getData(param) {
      const response = await fetch(`/api/${data.api}/${param}`);
      if (response.status === 401) {
        props.history.push('/login');
      } else {
        const data = await response.json();
        console.log(data.data.list);
        setM(data.data.list);
      }
    }
    getData(p);
  };
  const handleSelectControlled = (event) => {
    setSelectS(event.target.value);
    onChange({ [data.value]: selectM, [data.valueS]: event.target.value });
  };

  const handleCode = (editor, data, value) => {
    setValue(value);
    onChange(value);
  };

  switch (data.type) {
    case 'const':
      return (
        <TextField
          key={data.value}
          label={data.title}
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={value}
          onChange={handleChange}
          margin="normal"
        />
      );
    case 'code':
      return (
        <>
          <Typography>{data.title}</Typography>
          <CodeMirror
            value={value}
            options={{
              lineWrapping: true,
              mode: data.lang,
              theme: 'material',
            }}
            onBeforeChange={handleCode}
          />
        </>
      );
    case 'radio':
      return (
        <div>
          <Typography>{data.title}</Typography>
          <FormControl className={classes.formControl}>
            <RadioGroup
              aria-label="db"
              name="db"
              value={radio}
              onChange={handleRadio}
            >
              {data.values.map((item) => (
                <FormControlLabel key={item.id} value={item.id.toString()} control={<Radio />} label={item.name} />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      );
    case 'selects':
      return (
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-helper">
              {data.title}
            </InputLabel>
            <NativeSelect
              value={select}
              onChange={handleSelect}
              inputProps={{ name: data.title, id: 'age-native-helper' }}
            >
              <option value="" />
              {data.values.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </NativeSelect>
          </FormControl>
        </div>
      );
    case 'selects_linkage':
      return (
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-helper">
              {data.title}
            </InputLabel>
            <NativeSelect
              value={selectM}
              onChange={handleSelectController}
              inputProps={{ name: data.title, id: 'age-native-helper' }}
            >
              <option value="" />
              {data.values.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-helperddd">
              {data.titleS}
            </InputLabel>
            <NativeSelect
              value={selectS}
              onChange={handleSelectControlled}
              inputProps={{ name: data.titleS, id: 'age-native-helperddd' }}
            >
              <option value="" />
1
              {m.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </NativeSelect>
          </FormControl>
        </div>
      );
    default:
      return (
        <TextField
          key={data.value}
          label={data.title}
          InputLabelProps={{ shrink: true }}
          fullWidth
          multiline
          onChange={handleChange}
          margin="normal"
        />
      );
  }
}

function CreateJob({ match, history, location }) {
  const params = new URLSearchParams(location.search);
  const classes = useStyles();
  const [values, setValues] = React.useState({});
  const [originData, setOriginData] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const data = useFetch(`/api/jobs_items/${match.params.id}`, '');
  const origin = useFetch(`/api/jobs_events/${match.params.event_id}`, '', match.params.event_id === undefined);
  const title = data.data ? data.data.name : '';
  console.log(title);
  useEffect(() => {
    console.log('origin.data', origin.data);
    if (origin.data !== undefined) {
      setOriginData(origin.data.content);
      setValues(origin.data.content);
    }
  }, [origin]);

  useEffect(() => {
    console.log('data.data', data.data);
  }, [data]);
  const handleChange = (name) => (value) => {
    if (typeof value === 'object') {
      setValues({ ...values, ...value });
    } else {
      setValues({ ...values, [name]: value });
    }
  };
  function handleClose() {
    setOpen(false);
    window.location.replace('/i/jobs');
  }
  function copy() {
    const new_values = JSON.parse(JSON.stringify(values));
    delete (new_values.create_at);
    delete (new_values.status);
    const data_to_submit = {
      jobs_id: data.data.job_id,
      jobs_item: match.params.id,
      content: JSON.stringify(new_values),
      event_id: params.get('event_id') !== undefined ? params.get('event_id') : 0,
    };

    fetch('/api/jobs_events', {
      method: 'POST', // or 'PUT'
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
        setOpen(true);
      });
  }

  if (data.data) {
    const list = Array.isArray(data.data.arguments) ? data.data.arguments : data.data.arguments.content;
    console.log(data.data.arguments, list);
    return (
      <div>
        <Typography variant="h6">{title}</Typography>
        {list.map((k) => (
          <JobItem
            data={k}
            onChange={handleChange(k.value)}
            key={k.title}
            originD={originData[k.value]}
          />
        ))}
        <Button onClick={copy} variant="contained" className={classes.button}>
      提交
        </Button>
        <Button onClick={history.goBack} variant="contained" className={classes.button}>
      取消
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">提交成功</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              提交成功，请关注钉钉提示.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">
              确认
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  return (<div />);
}
export default CreateJob;
