import React from 'react'
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../components/Loader';
import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, Typography } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { addToCartAC, addToCartThunk } from '../redux/cartReducer';

const useStyles = makeStyles((theme => ({
    img: {
        width: '100%'
    },
    grid: {
        marginTop: theme.spacing(2)
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(2)
    },
    button: {
        alignSelf: 'flex-end',
        marginTop: theme.spacing(1)
    }
})))

export const ProductItem = () => {
    const { id } = useParams()
    const product = useSelector(state => state.products.products[id]) || {}
    const isLoading = useSelector(state => state.products.loading)
    const { isAuth, currentUser } = useSelector(state => state.auth)
    const classes = useStyles()
    const dispatch = useDispatch()
    const { control, handleSubmit } = useForm({
        defaultValues: {
            quantity: 1
        }
    })
    const quantityList = Array(10).fill(0).map((_, i) => i + 1).map(item => {
        return (
            <MenuItem value={ item } key={ item }>{ item }</MenuItem>
        )
    })

    const onSubmit = ({ quantity }) => {
        const productToCart = {
            product: { ...product, quantity },
            key: id
        }
        if (isAuth) {
            dispatch(addToCartThunk(currentUser.uid, productToCart))
        } else {
            dispatch(addToCartAC(productToCart))
        }
    }

    return (
        <div>
            {
                isLoading
                    ? <Loader/>
                    : (
                        <Grid container justify="space-between" spacing={ 2 } className={ classes.grid }>
                            <Grid item xs={ 12 } sm={ 4 }>
                                <img src={ product.img } className={ classes.img } alt={product.title}/>
                            </Grid>
                            <Grid item xs={ 12 } sm={ 4 }>
                                <Typography gutterBottom component="h3" variant="h5">{ product.title }</Typography>
                                <Typography gutterBottom component="p" variant="subtitle1">{ product.description }</Typography>
                                <Typography component="h4" variant="h6">Price: { product.price }</Typography>
                            </Grid>
                            <Grid item xs={ 12 } sm={ 4 }>
                                <Paper className={ classes.paper }>
                                    <form onSubmit={ handleSubmit(onSubmit) } className={ classes.form }>
                                        <Typography gutterBottom component="h4" variant="h6">
                                            Price: { product.price }
                                        </Typography>
                                        <FormControl className={ classes.select }>
                                            <InputLabel id="quantity-label">Quantity:</InputLabel>
                                            <Controller
                                                as={
                                                    <Select labelId="quantity-label">
                                                        { quantityList }
                                                    </Select>
                                                }
                                                name="quantity"
                                                control={ control }
                                            />
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            className={ classes.button }
                                        >
                                            Buy Now
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={ classes.button }
                                        >
                                            Add To Cart
                                        </Button>
                                    </form>
                                </Paper>
                            </Grid>
                        </Grid>
                    )
            }
        </div>
    )
}