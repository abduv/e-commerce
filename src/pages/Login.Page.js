import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormHelperText, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Firebase } from '../firebase/firebase';
import { useHistory } from 'react-router';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    paper: {
        margin: '3rem auto',
        maxWidth: 600,
        padding: `${ theme.spacing(1) }px ${ theme.spacing(2) }px`
    },
    submitButton: {
        margin: theme.spacing(1)
    }
}))

export const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const classes = useStyles()
    const history = useHistory()
    const { errors, handleSubmit, register, setError, clearErrors } = useForm({
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const firebase = new Firebase()

    const clearErrorWithTimeout = name => {
        setTimeout(() => {
            clearErrors(name)
        }, 3000)
    }

    useEffect(() => {
        return () => {
            clearErrors()
        }
    }, [])

    const onSubmit = async data => {
        setIsLoading(true)
        firebase.auth.signInWithEmailAndPassword(data.email, data.password)
            .then(() => history.push('/'))
            .catch(e => {
                if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
                    setError('error', {
                        message: 'Неверные данные для входа'
                    })
                } else {
                    setError('error', {
                        message: 'Что-то пошло не так. Повторите попытку'
                    })
                }
                clearErrorWithTimeout('error')
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className={ classes.root }>
            <Paper elevation={ 2 } variant="elevation" className={ classes.paper }>
                <form onSubmit={ handleSubmit(onSubmit) }>
                    <Grid container spacing={ 1 }>
                        <Grid item container xs={ 12 } spacing={ 3 }>
                            <Grid item xs={ 6 }>
                                <TextField
                                    inputRef={ register({
                                        required: 'Обязательно'
                                    }) }
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    disabled={ isLoading }
                                    error={ !!errors.email }
                                    helperText={ errors.email?.message }
                                />
                            </Grid>
                            <Grid item xs={ 6 }>
                                <TextField
                                    inputRef={ register({
                                        required: 'Обязательно'
                                    }) }
                                    name="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    disabled={ isLoading }
                                    error={ !!errors.password }
                                    helperText={ errors.password?.message }
                                />
                            </Grid>
                        </Grid>
                        <Grid item container justify="flex-end">
                            {
                                errors.error ? (
                                    <FormHelperText
                                        error={ !!errors.error }
                                        filled={ true }
                                        variant="standard"
                                    >
                                        <Typography variant="body2" component="span">
                                            { errors.error.message }
                                        </Typography>
                                    </FormHelperText>
                                ) : null
                            }
                        </Grid>
                        <Grid item container justify="flex-end">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={ classes.submitButton }
                                disabled={ isLoading }
                            >
                                Войти
                            </Button>
                        </Grid>
                        <Grid item container justify="flex-end">
                            <Button component={ Link } to="/registration" disabled={ isLoading }>
                                Создать аккаунт
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </div>
    )
}