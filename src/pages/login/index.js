import React, { useState } from "react";

import Container from '@material-ui/core/Container';

import Paper from '@material-ui/core/Paper';
import Button  from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';


import useStyles from "./styles";
import { Link, Redirect } from "react-router-dom";
import isEmail from 'validator/lib/isEmail'

import {useFirebase} from '../../components/FirebaseProvider'
import AppLoading from "../../components/AppLoading";


export default function Login(props) {
    const {location} = props
    const classes = useStyles();
    
    const [form, setForm] = useState({
        email:'',
        password:''
    });

    const [error, setError] = useState({
        email:'',
        password:''
    });

    const [isSubmiting, setSubmiting] = useState(false)

    const {auth, user, loading} = useFirebase();

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })

        setError({
            ...error,
            [e.target.name]:''
        })
    }

    const validate = () => {
        const newError = {...error};

        if(!form.email) {
            newError.email="Email wajib diisi"
        }else if(!isEmail(form.email)){
            newError.email="Email tidak valid"
        }

        if(!form.password) {
            newError.password = 'Password wajib diisi'
        }

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        
        const findErrors = validate();

        if(Object.values(findErrors).some(err=>err !=='')) {
            setError(findErrors)
        } else {
            try {
                setSubmiting(true);
                await auth.signInWithEmailAndPassword(form.email,form.password)
            } catch (error) {
                const newError = {};

                switch (error.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email tidak ditemukan'    
                    break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid'
                    break;
                    case 'auth/wrong-password':
                        newError.password = 'Password Salah'
                    break;
                    case 'auth/user-disabled':
                        newError.email = "User blocked"
                    break;
                    default:
                        newError.email = "Something wrong"
                        break;
                }

                setError(newError);
                setSubmiting(false);
            }
        }
    }

    if (loading) {
        return <AppLoading/>
    }

    if (user) {
        const redirectTo = location.state && 
        location.state.from && 
        location.state.from.pathname ?
        location.state.from.pathname : '/';
        return <Redirect to={redirectTo} />
    }
    
    return (
        <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography 
                    className={classes.judul}
                    variant="h5"
                    component="h1"
                >Login</Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        margin="normal"
                        label="Alamat Email"
                        fullWidth
                        required
                        value={form.email}
                        onChange={handleChange}
                        helperText={error.email}
                        error={error.email?true:false}
                        disabled={isSubmiting}
                    />
                    <TextField
                        id="password"
                        type="password"
                        name="password"
                        margin="normal"
                        label="Password"
                        fullWidth
                        required
                        value={form.password}
                        onChange={handleChange}
                        helperText={error.password}
                        error={error.password?true:false}
                        disabled={isSubmiting}
                    />
                    
                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button
                                fullWidth
                                color="primary" 
                                type="submit" 
                                variant="contained"
                                size="large"
                                disabled={isSubmiting}
                                >Login</Button>
                        </Grid>
                        <Grid item xs>
                            <Button 
                                className={classes.mkiri}
                                fullWidth
                                component={Link}
                                to="/registrasi"
                                variant="contained"
                                size="large"
                                disabled={isSubmiting}
                                >Daftar</Button>
                        </Grid>
                    </Grid>

                   <div className={classes.forgotPassword}>
                        <Typography component={Link} to="/lupa-password">
                            Lupa Password ?
                        </Typography>
                   </div>
                </form>
            </Paper>
        </Container>
    );
}
