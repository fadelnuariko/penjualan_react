import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    judul:{
        color: theme.palette.primary.main,
        textAlign:'center',
        marginBottom:theme.spacing(2),
        fontWeight:'bold'
    },
    paper:{
        marginTop: theme.spacing(8),
        padding:theme.spacing(6)
    },
    buttons:{
        marginTop:theme.spacing(3)
    },
    mkiri:{
        marginLeft:theme.spacing(1)
    },
    forgotPassword:{
        marginTop:theme.spacing(2)
    }
}))

export default useStyles;
