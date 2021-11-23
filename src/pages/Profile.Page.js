import React from 'react'
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme => ({
    profile: {
        margin: theme.spacing(2)
    }
})))

export const Profile = () => {
    const currentUser = useSelector(state => state.auth.currentUser)
    const classes = useStyles()

    return (
        <div className={classes.profile}>
            <Typography variant="subtitle1">Name: {currentUser.displayName}</Typography>
            <Typography variant="subtitle1">Email: {currentUser.email}</Typography>
        </div>
    )
}