import React, { useState } from 'react'
import { Button, Grid, makeStyles, Paper, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { Firebase } from '../firebase/firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

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

export const Registration = () => {
    const [isLoading, setIsLoading] = useState(false)
    const classes = useStyles()
    const history = useHistory()
    const { errors, handleSubmit, register, setError } = useForm({
        mode: 'onBlur',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    })
    const firebase = new Firebase()

    const onSubmit = async data => {
        setIsLoading(true)
        try {
            const res = await firebase.auth.createUserWithEmailAndPassword(data.email, data.password)
            await res.user.updateProfile({ displayName: `${ data.firstName } ${ data.lastName || '' }` })
            history.push('/')
        } catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                setError('email', { message: 'Такой email уже занят' })
                setIsLoading(false)
            } else {
                console.log(e)
            }
        }
    }

    return (
        <div className={ classes.root }>
            <Paper elevation={ 2 } variant="elevation" className={ classes.paper }>
                <form onSubmit={ handleSubmit(onSubmit) }>
                    <Grid container spacing={ 1 }>
                        <Grid item container xs={ 12 } spacing={ 3 }>
                            <Grid item xs={ 12 } sm={ 6 }>
                                <TextField
                                    inputRef={ register({
                                        required: 'Обязательно',
                                        pattern: {
                                            value: /[a-zA-Z]\w+/g,
                                            message: 'Имя пользователя может содержать только латинские буквы'
                                        }
                                    }) }
                                    name="firstName"
                                    label="First name"
                                    fullWidth
                                    disabled={isLoading}
                                    error={ !!errors.firstName }
                                    helperText={ errors.firstName?.message }
                                />
                            </Grid>
                            <Grid item xs={ 12 } sm={ 6 }>
                                <TextField
                                    inputRef={ register({
                                        pattern: {
                                            value: /[a-zA-Z]\w+/g,
                                            message: 'Имя пользователя может содержать только латинские буквы'
                                        }
                                    }) }
                                    name="lastName"
                                    label="Last name"
                                    fullWidth
                                    disabled={isLoading}
                                    error={ !!errors.lastName }
                                    helperText={ errors.lastName?.message }
                                />
                            </Grid>
                        </Grid>
                        <Grid item container xs={ 12 } spacing={ 3 }>
                            <Grid item xs={ 12 } sm={ 6 }>
                                <TextField
                                    inputRef={ register({
                                        required: 'Обязательно',
                                        pattern: {
                                            value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                            message: 'Введите правильный email'
                                        }
                                    }) }
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    disabled={isLoading}
                                    error={ !!errors.email }
                                    helperText={ errors.email?.message }
                                />
                            </Grid>
                            <Grid item xs={ 12 } sm={ 6 }>
                                <TextField
                                    inputRef={ register({
                                        required: 'Обязательно',
                                        minLength: {
                                            value: 6,
                                            message: 'Минимальная длина пароля 6 символов'
                                        }
                                    }) }
                                    name="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    disabled={isLoading}
                                    error={ !!errors.password }
                                    helperText={ errors.password?.message }
                                />
                            </Grid>
                        </Grid>
                        <Grid item container justify="flex-end">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={ classes.submitButton }
                                disabled={isLoading}
                            >
                                Зарегистрироваться
                            </Button>
                        </Grid>
                        <Grid item container justify="flex-end">
                            <Button component={Link} to="/login" disabled={isLoading}>
                                Войти в аккаунт
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </div>
    )
}