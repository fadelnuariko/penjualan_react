import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme=>({
    paper:{
        marginTop:theme.spacing(8),
        padding:theme.spacing(5),
        textAlign:'center'
    }
}))

export default useStyles;