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


export default function Registrasi() {
    const classes = useStyles();
    
    const [form, setForm] = useState({
        email:'',
        password:'',
        ulangi_password:''
    });

    const [error, setError] = useState({
        email:'',
        password:'',
        ulangi_password:''
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

        if(!form.ulangi_password) {
            newError.ulangi_password = 'Ulangi Password wajib diisi'
        }else if(form.ulangi_password !== form.password) {
            newError.ulangi_password = 'Password tidak sama'
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
                await auth.createUserWithEmailAndPassword(form.email,form.password)
            } catch (error) {
                const newError = {};

                switch (error.code) {
                    case 'auth/email-already-in-use':
                        newError.email = 'Email sudah terdaftar'    
                    break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid'
                    break;
                    case 'auth/weak-password':
                        newError.password = 'Password terlalu lemah'
                    break;
                    case 'auth/operation-not-allowed':
                        newError.email = "Metode email dan password tidak support"
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
                >Buat Akun Baru</Typography>
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
                    <TextField
                        id="ulangi_password"
                        type="password"
                        name="ulangi_password"
                        margin="normal"
                        label="Ulangi Password"
                        fullWidth
                        required
                        value={form.ulangi_password}
                        onChange={handleChange}
                        helperText={error.ulangi_password}
                        error={error.ulangi_password?true:false}
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
                                >Daftar</Button>
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
