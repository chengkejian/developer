import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const logs = [
    'supervisord/mjmh-sc-applet.log',
    'supervisord/mjmh-sc-admin.log',
    'supervisord/mjmh-sc-invoicing.log',
    'supervisord/mjmh-sc-internal.log',
    'supervisord/mjmh-sc-warehouse.log',
    'supervisord/mjmh-sc-proxy.log',
    'supervisord/mjmh-sc-yzh.log',
    'supervisord/mjmh-sc-task.log',
    'supervisord/trump-amqp-server.log',
    'supervisord/trump-amqp-proxy.log',
    'supervisord/trump-amqp-worker.log',
  ];
  
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
//    margin: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(0),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
  }, 
  textField_wide: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 240,
  },       
  button: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
//    marginBottom: theme.spacing(2),
//    margin: theme.spacing(1),
  },
slider: {
//    height: 600,
    paddingTop: "60px",
    paddingLeft: "5px",
  },
  gridListRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%'
  },
  MyGridListTile: {
    height: '60px !important',
  }
}));


function formatFileSize(fileSize, withCell=true, fix_num=1, fix_cell=null) {
    var size = 0;
    var cell = "B";
    if(fix_cell){
        if (fix_cell === "B") {
            size = fileSize
        } else if (fix_cell === "K") {
            size = fileSize / 1024;
            size = size.toFixed(fix_num);
            cell = 'K';
        } else if (fix_cell === "M") {
            size = fileSize / (1024*1024);
            size = size.toFixed(fix_num);
            cell = 'M';
        } else {
            size = fileSize / (1024*1024*1024);
            size = size.toFixed(fix_num);
            cell = 'G';
        }
    }else{
        if (fileSize < 1024) {
            size = fileSize
        } else if (fileSize < (1024*1024)) {
            size = fileSize / 1024;
            size = size.toFixed(fix_num);
            cell = 'K';
        } else if (fileSize < (1024*1024*1024)) {
            size = fileSize / (1024*1024);
            size = size.toFixed(fix_num);
            cell = 'M';
        } else {
            size = fileSize / (1024*1024*1024);
            size = size.toFixed(fix_num);
            cell = 'G';
        }
    }

    if(withCell){
        return size + cell;
    }else{
        return size;
    }
}

export default function LogSelect() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    file: '',
    exception: false,
    user_id: '',
    uuid: '',
    url: '',
    raw: false,
    file_size: 10,
    file_cell: '--',
    block_size: 9,
    slider_state: true,
    slider_step:1,
    slider_marks: [
          {
            value: 0,
            label: '0B',
          },
          {
            value: 10,
            label: '10B',
          },
        ],
  });

//   const inputLabel = React.useRef(null);
  const handleChange = event => {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
    console.log("---event.target.value="+event.target.value)
    setFileSize(event.target.value)
  };
  const handleChangeText = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleChangeSwitch = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };
  const handleChangeSilder = (event, newValue) => {
    setValues(oldValues => ({
      ...oldValues,
      block_size: newValue,
    }));
  };
function format_slider_value(value) {
//  console.log("---"+values.block_size)
  return formatFileSize(value,false,1,values.file_cell);
}
  async function setFileSize(fileName) {
        const response = await fetch(`http://yaoyingli.com:9000/get_filesize?type=raw&name=${fileName}`);
        //const response = await fetch(`http://127.0.0.1:9001/get_filesize?type=raw&name=${fileName}`);
        const data = await response.json();
//        console.log("raw-->"+data.data)
        if(data.data === "--"){
            alert("文件不存在！")
        }else{
            const max = data.data
            const min = data.data>1024*1024 ? (data.data - 1024*1024) : 0
            const slider_marks = [
              {
                value: 0,
                label: '0'+formatFileSize(max).substr(-1,1),
              },
              {
                value: max,
                label: formatFileSize(max),
              },
            ];
            const slider_step = 1;
            setValues(oldValues => ({
              ...oldValues,
              file_size: data.data,
              block_size: min,
              slider_state: false,
              slider_marks: slider_marks,
              slider_step: slider_step,
              file_cell: formatFileSize(max).substr(-1,1),
            }));
        }
}
  const handleClickBution = () => {
//    alert("values="+JSON.stringify(values))
    var url = '/log.html?1=1';
    if(values.file === ''){
        window.open('about:blank', 'log');
    }else{
        url += "&file="+values.file;
        if(values.raw){
            url += "&raw=True";
        }
        if(values.exception){
            url += "&exception=True";
        }
        if(values.user_id){
            url += "&user_id="+values.user_id;
        }
        if(values.uuid){
            url += "&uuid="+values.uuid;
        }
        if(values.url){
            url += "&url="+values.url;
        }
        if(values.block_size){
            url += "&block_size="+(values.file_size - values.block_size);
        }
        window.open(url, 'log');
    }
  };
  return (
      <div>
          <div>
            <form className={classes.root} autoComplete="off">
                            <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="age-simple">选择日志[{formatFileSize(values.file_size)}]</InputLabel>
                              <Select
                                onChange={handleChange}
                                value={values.file}
                                displayEmpty
                                name="file">
                                {logs.map((log) => (
                                  <MenuItem key={log} value={log}>{log}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControlLabel className={classes.formControlLabel}
                              control={
                                <Switch
                                  checked={values.raw}
                                  onChange={handleChangeSwitch('raw')}
                                  value="raw"
                                  color="primary"
                                />
                              }
                              label="原始日志"
                            />
                            <FormControlLabel className={classes.formControlLabel}
                              control={
                                <Switch
                                  checked={values.exception}
                                  onChange={handleChangeSwitch('exception')}
                                  value="exception"
                                  color="primary"
                                />
                              }
                              label="过滤Error"
                            />
                            <TextField
                              id="standard-search"
                              label="登陆用户ID"
                              type="search"
                              className={classes.textField}
                              value={values.user_id}
                              onChange={handleChangeText('user_id')}
                            />
                            <TextField
                              id="standard-search"
                              label="UUID"
                              type="search"
                              className={classes.textField_wide}
                              value={values.uuid}
                              onChange={handleChangeText('uuid')}
                            />
                            <TextField
                              id="standard-search"
                              label="URL"
                              type="search"
                              className={classes.textField_wide}
                              value={values.url}
                              onChange={handleChangeText('url')}
                            />
                            <Button variant="contained" onClick={handleClickBution} color="primary" className={classes.button}>
                              查看
                                  </Button>
            </form>
          </div>
          <GridList cellHeight="auto" className={classes.gridList} cols={100}>
            <GridListTile cols={5}>
              <div className={classes.slider} style={{ height: 'calc(100vh - 210px)' }}>
                  <Slider
                    max={values.file_size}
                    step={values.slider_step}
                    disabled={values.slider_state}
                    value={values.block_size}
                    valueLabelDisplay="auto"
                    aria-labelledby="slider-block"
                    valueLabelFormat={format_slider_value}
                    onChange={handleChangeSilder}
                    marks={values.slider_marks}
                    orientation="vertical"
                    track="inverted"
                  />
              </div>    
            </GridListTile>
            <GridListTile cols={95}>
              <iframe
                title="log"
                name="log"
                id="log"
                style={{
                    backgroundColor: '#cfe8fc',
                    width: '100%',
                    height: 'calc(100vh - 160px)',
                    border: '1px solid #111',
                    marginTop: '5px',
                }}
              />
            </GridListTile>
          </GridList>          
      </div>
  );
}
