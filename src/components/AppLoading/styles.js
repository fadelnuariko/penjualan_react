import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme=>({
    title : {
        color: theme.palette.primary.main,
        textAlign:'center',
        marginBottom:theme.spacing(1)
    },
    loadingBox:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        height:'100vh'
    }
}))

export default useStyles;