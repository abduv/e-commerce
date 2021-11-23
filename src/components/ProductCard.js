import React from 'react'
import {
    Button, ButtonBase,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    makeStyles,
    Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAC, addToCartThunk } from '../redux/cartReducer';

const useStyles = makeStyles(theme => ({
    root: {
        width: 350,
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    img: {
        height: 200
    },
    button: {
        alignSelf: 'flex-end'
    },
    cardButton: {
        display: "block"
    }
}))

export const ProductCard = ({ product, id }) => {
    const classes = useStyles()
    const isAuth = useSelector(state => state.auth.isAuth)
    const currentUser = useSelector(state => state.auth.currentUser)
    const dispatch = useDispatch()

    const addToCartHandler = () => {
        const productToCart = {
            product: { ...product, quantity: 1 },
            key: id
        }
        if (isAuth) {
            dispatch(addToCartThunk(currentUser.uid, productToCart))
        } else {
            dispatch(addToCartAC(productToCart))
        }
    }

    return (
        <Card className={ classes.root }>
            <ButtonBase
                component={ Link }
                to={ `/product/${ id }` }
                className={ classes.cardButton }
            >
                <CardMedia
                    className={ classes.img }
                    image={ product.img }
                    title={ product.title }
                />
                <CardContent>
                    <Typography variant="h5" component="h4">
                        { product.title }
                    </Typography>
                    <Typography variant="h6" component="h6">
                        Price: { product.price }
                    </Typography>
                </CardContent>
            </ButtonBase>
            <CardActions className={ classes.button }>
                <Button color="secondary">
                    Buy Now
                </Button>
                <Button color="primary" onClick={ addToCartHandler }>
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    )
}