/* eslint-disable react/jsx-filename-extension */
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DraftsIcon from '@material-ui/icons/Drafts';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { deepOrange } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import React, { useEffect } from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { SnackbarProvider } from 'notistack';
import Markdown from '../components/Markdown';
import CreateJob from '../create_job';
import Detail from '../detail';
import Edit from '../edit';
import useFetch from '../hooks/useFetchTs';
import Jobs from './jobs/Jobs';
import Events from './jobs/Events';
import Event from './jobs/Event';
import ListView from '../list';
import Album from '../resource';
import SQL from '../sql';
import SQLAdd from '../sqladd';
import Commands from './commands/Commands';
import Logout from './Logout';
import AlterPasswd from './AlterPasswd';
import JobsList from './jobs/JobsList';
import JobsItems from './jobs/JobsItems';
import Runner from './jobs/Runner';
import RunnerItems from './jobs/RunnerItems';
import Cron from './jobs/Cron';
import CronLog from './jobs/CronLog';
import Log from './Log';
import Log_less from './Log_less';
import SshForwarder from './jobs/SshForwarder'
import SD from './sd';


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
  grow: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  logo: {
    width: '100%',
    height: '64px',
    fontSize: '24px',
    color: '#123',
    backgroundColor: '#eee',
    display: 'block',
    textAlign: 'center',
    lineHeight: '64px',
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

const string = '```python\ndef hello():\n    print(\'Welcome to aibili technology co., ltd.\')\n\n\nhello()\n```';
function Root() {
  return (
    <div style={{ padding: '10px' }}>
      <Markdown>
        {string}
      </Markdown>
    </div>
  );
}

function getIcon(icon:string) {
  switch (icon) {
    case 'InboxIcon':
      return <InboxIcon color="primary" />;
    case 'ArrowForwardIcon':
      return <ArrowForwardIcon color="secondary" />;
    case 'HomeIcon':
      return <HomeIcon color="action" />;
    case 'DraftsIcon':
      return <DraftsIcon color="disabled" />;
    case 'ExitToAppIcon':
      return <ExitToAppIcon />;
    default:
      return <InboxIcon color="disabled" />;
  }
}
interface ExtrasProps{
  extras?: Extras,
  onClickAlterPasswd: any,

}

function LoginOut({extras}: ExtrasProps) {
  const first_name = extras !== undefined ? extras.first_name : '';
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
  }
  const [showAlterPasswd, setShowAlterPasswd] = React.useState(false);

  function handleClose() {
    setAnchorEl(null);
  }
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div>
      <Avatar  
      className={classes.avatar} 
      onClick={handleClick}>
        {first_name}
      </Avatar>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
        disableRestoreFocus
      >
        <List component="nav" aria-label="secondary mailbox folders">
          <ListItem button onClick={() => (setShowAlterPasswd(true))}>
            <ListItemText primary="修改密码" />
          </ListItem>
          <ListItem button onClick={Logout}>
            <ListItemText primary="退出登录" />
          </ListItem>
        </List>

      </Popover>
      { showAlterPasswd
      && <AlterPasswd closeDialog={() => { setShowAlterPasswd(false); }} />
      }
    </div>
  );
}

class Extras {
  first_name?: string
}
interface IResult {
  list: Object,
  extras?: Extras,
}
function ResponsiveDrawer(props: RouteComponentProps) {
  const menuData = useFetch<IResult>('/api/menus?sort=-pos', props.history);
  const [wsReconnect, setWsReconnect] = React.useState(false);
  const [showAlterPasswd, setShowAlterPasswd] = React.useState(false);

  const [title, setTitle] = React.useState('首页');
  const [tips, setTips] = React.useState('提示');

  useEffect(() => {
    let wsScheme = 'ws';
    if(window.location.protocol === 'https:') {
      wsScheme = 'wss'
    }
    const ws = new WebSocket(`${wsScheme}://${window.location.host}/api/feed`);
    function connect() {
      ws.onopen = function onWsOpen(evt) {
        // eslint-disable-next-line no-console
        console.log(evt);
        const payload = {
          type: 'client',
          file: 'fn',
        };
        // Make the request to the WebSocket.
        ws.send(JSON.stringify(payload));
      };
      ws.onmessage = function onWsMsg(evt) {
        // Create a div with the format `user: message`.
        // eslint-disable-next-line no-console
        console.log(evt);
        document.title = `Aibili Developers ${evt.data}`;
        setTips(`${evt.data}`);
      };
      ws.onclose = function onWsClose(e) {
        // eslint-disable-next-line no-console
        console.log(e);
        setTimeout(() => {
          setWsReconnect(!wsReconnect);
        }, 1000);
      };
      ws.onerror = function onWsError(err) {
        // eslint-disable-next-line no-console
        // console.error('Socket encountered error: ', err.message, 'Closing socket');
        setTimeout(() => {
          setWsReconnect(!wsReconnect);
        }, 1000);
      };
    }
    connect();
  },
  [wsReconnect]);
  // console.log(`menuData=${JSON.stringify(menuData)}`);
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  function goto(name:string, url:string) {
    const iUrl = `/i${url}`;
    setTitle(name);
    props.history.push(iUrl);
  }

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }
  function onClickAlterPasswd() {
    setShowAlterPasswd(true);
    console.log(showAlterPasswd);
  }
  let menuList = [];
  if (menuData && menuData.list !== undefined) {
    menuList = [];
    menuList = menuData.list as any;
    // console.log(`menuList=${JSON.stringify(menuList)}`);
  }
  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <b className={classes.logo}>
          Aibili Tech
        </b>
      </div>
      <Divider />
      <List>
        {menuList.map((x: any) => (
          <ListItem button key={x.id} onClick={() => goto(x.name, x.url)}>
            <ListItemIcon>
              {getIcon(x.icon)}
            </ListItemIcon>
            <ListItemText primary={x.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  return (
    <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} noWrap>
              {title}
            </Typography>
            <Typography noWrap>
              {tips}
            </Typography>
            <LoginOut extras={menuData && menuData.extras} onClickAlterPasswd={onClickAlterPasswd} />
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Route exact path="/i" component={Root} />
          <Route exact path="/i/resource" component={Album} />
          <Route exact path="/i/log" component={Log} />
          <Route exact path="/i/log_less" component={Log_less} />
          <Route exact path="/i/logout" component={Logout} />
          <Route exact path="/i/commands" component={Commands} />
          <Route exact path="/i/sql" component={SQL} />
          <Route exact path="/i/sql/:page" component={SQL} />
          <Route exact path="/i/:table/list" component={ListView} />
          <Route exact path="/i/:table/list/:page" component={ListView} />
          <Route exact path="/i/sqladd" component={SQLAdd} />
          <Route exact path="/i/:item/:id/detail" component={Detail} />
          <Route exact path="/i/:item/:id/edit" component={Edit} />
          <Route exact path="/i/create_job/:id" component={CreateJob} />
          <Route exact path="/i/create_job/:id/:event_id" component={CreateJob} />
          <Route exact path="/i/events/:page" component={Events} />
          <Route exact path="/i/event/:id" component={Event} />
          <Route exact path="/i/events" component={Events} />
          <Route exact path="/i/jobs/:page" component={Jobs} />
          <Route exact path="/i/jobs" component={Jobs} />
          <Route exact path="/i/jobs_list" component={JobsList} />
          <Route exact path="/i/jobs_items" component={JobsItems} />
          <Route exact path="/i/runner" component={Runner} />
          <Route exact path="/i/runner_items" component={RunnerItems} />
          <Route exact path="/i/cron" component={Cron} />
          <Route exact path="/i/cron_log" component={CronLog} />
          <Route exact path="/i/ssh_forwarder" component={SshForwarder}/>
          <Route exact path="/i/sd" component={SD} />
        </main>

      </div>
    </SnackbarProvider>
  );
}

Commands.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
};
ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  history: ReactRouterPropTypes.history.isRequired,

};

export default withRouter(ResponsiveDrawer);
