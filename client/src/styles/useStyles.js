import { makeStyles } from '@material-ui/core/styles';
export const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paper: {
      padding: theme.spacing(4),
      maxWidth: 400,
      width: '100%',
    },
    textField: {
      marginBottom: theme.spacing(2),
    },
    loginButton: {
      backgroundImage: 'linear-gradient(to right, #000428, #004E92)',
      color: theme.palette.common.white,
      '&:hover': {
        background: '#004E92',
      },
    },
    forgotPassword: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: theme.spacing(2),
      textDecoration: 'none',
      color: theme.palette.text.secondary,
    },
  }));