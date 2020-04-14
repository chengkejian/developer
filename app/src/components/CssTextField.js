import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const CssTextField = withStyles({
    root: {
        '& label': {
          transform: 'translate(14px, 10px) scale(1)',
      },
        '& .MuiOutlinedInput-root': {
      '& input': {
          padding: '9px 14px',
      }
        },
        },
})(TextField);

export default CssTextField;
