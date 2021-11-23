import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { removeItemFromCartAC, removeItemFromCartThunk } from '../redux/cartReducer';

const useStyles = makeStyles(theme => ({
    grid: {
        marginTop: theme.spacing(1)
    },
    img: {
        width: '100%'
    },
    paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(1)
    }
}))

export const Cart = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart.cart)
    const { isAuth, currentUser } = useSelector(state => state.auth)
    const cartLength = Object.keys(cart || {}).length

    const removeItemHandler = key => {
        if (isAuth) {
            dispatch(removeItemFromCartThunk(currentUser.uid, key))
        } else {
            dispatch(removeItemFromCartAC(key))
        }
    }

    return (
        <Grid container direction="column" className={ classes.grid }>
            {
                !cartLength
                    ? <Typography variant="h3">В корзине нет товаров</Typography>
                    : Object.keys(cart).map(key => {
                        const product = cart[key]
                        const amount = `$${ +product.price.substring(1) * product.quantity }`

                        return (
                            <Paper key={ key } className={ classes.paper }>
                                <Grid item container spacing={ 2 }>
                                    <Grid item xs={ 12 } sm={ 3 }>
                                        <img src={ product.img } alt={ product.title } className={ classes.img }/>
                                    </Grid>
                                    <Grid item xs={ 12 } sm={ 6 }>
                                        <Typography gutterBottom variant="h6">{ product.title }</Typography>
                                        <Typography gutterBottom variant="h6">
                                            { `${ product.price } x ${ product.quantity }шт. = ${ amount }` }
                                        </Typography>
                                    </Grid>
                                    <Grid item container xs={ 12 } sm={ 3 } alignItems="center" justify="flex-end">
                                        <Button
                                            color="secondary"
                                            variant="outlined"
                                            onClick={ () => removeItemHandler(key) }
                                        >
                                            Удалить
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )
                    })
            }
        </Grid>
    )
}