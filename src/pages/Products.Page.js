import React, { useEffect, useRef } from 'react'
import { Loader } from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { ProductCard } from '../components/ProductCard';
import { fetchProductsThunk } from '../redux/productsReducer';

const useStyles = makeStyles(theme => ({
    header: {
        margin: theme.spacing(2)
    }
}))

export const Products = () => {
    const isMountedRef = useRef(false)
    const products = useSelector(state => state.products.products)
    const isLoading = useSelector(state => state.products.loading)
    const classes = useStyles()
    const dispatch = useDispatch()

    useEffect(() => {
        isMountedRef.current = true
        if (isMountedRef.current) {
            dispatch(fetchProductsThunk())
        }

        return () => {
            isMountedRef.current = false
        }
    }, [])

    return (
        <Grid container>
            <Grid item className={ classes.header } container justify="center">
                <Typography
                    component="h1"
                    variant="h3"
                >
                    Products
                </Typography>
            </Grid>
            <Grid
                item
                container
                justify="space-evenly"
                spacing={ 3 }
            >
                {
                    isLoading
                        ? <Loader/>
                        : Object.keys(products).map(key => {
                            const product = products[key]
                            return (
                                <ProductCard
                                    key={ key }
                                    id={ key }
                                    product={ product }
                                />
                            )
                        })
                }
            </Grid>
        </Grid>
    )
}