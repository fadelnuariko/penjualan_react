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

import {useSnackbar} from 'notistack'


export default function LupaPassword() {
    const classes = useStyles();
    
    const [form, setForm] = useState({
        email:''
    });

    const [error, setError] = useState({
        email:''
    });

    const [isSubmiting, setSubmiting] = useState(false)

    const {auth, user, loading} = useFirebase();
    const {enqueueSnackbar} = useSnackbar();

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
                const actionCodeSettings = {
                    url : `${window.location.origin}/login`
                }
                await auth.sendPasswordResetEmail(form.email, actionCodeSettings);
                enqueueSnackbar(`Sebuah tautan untuk me-reset password telah dikirim ke ${form.email}`, {
                    variant:'success'
                })
                setSubmiting(false);
            } catch (error) {
                const newError = {};

                switch (error.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email tidak terdaftar'    
                    break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid'
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
        return <Redirect to="/" />
    }
    
    return (
        <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography 
                    className={classes.judul}
                    variant="h5"
                    component="h1"
                >Lupa Password</Typography>
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
                    
                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button
                                fullWidth
                                color="primary" 
                                type="submit" 
                                variant="contained"
                                size="large"
                                disabled={isSubmiting}
                                >Kirim</Button>
                        </Grid>
                        <Grid item xs>
                            <Button 
                                className={classes.mkiri}
                                fullWidth
                                component={Link}
                                to="/login"
                                variant="contained"
                                size="large"
                                disabled={isSubmiting}
                                >Login</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
