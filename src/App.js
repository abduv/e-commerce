import React, { useEffect, useRef } from 'react'
import { Container, MuiThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
import { pink, teal } from '@material-ui/core/colors';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from './components/Navbar';
import { useRoutes } from './routes';
import { Firebase } from './firebase/firebase';
import { listenAuthStateChanged, loginAC } from './redux/authReducer';
import { storage } from './utils/utils';
import { listenCartThunk, updateCartAC, updateCartThunk } from './redux/cartReducer';
import { fetchProductsThunk } from './redux/productsReducer';
import { CART_TOGGLE_IS_LOADING } from './redux/types';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: teal[700]
        },
        secondary: {
            main: pink[800]
        }
    }
})

function App() {
    const isMountedRef = useRef(false)
    const { isAuth, currentUser } = useSelector(state => state.auth)
    const cart = useSelector(state => state.cart.cart)
    const routes = useRoutes(isAuth)
    const dispatch = useDispatch()
    const firebase = new Firebase()

    const cartListener = snapshot => {
        dispatch(updateCartAC(snapshot.val()))
    }

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            if (user) {
                dispatch(loginAC(user))
                const userCart = storage('cart')

                dispatch(updateCartThunk(user.uid, userCart))
                localStorage.removeItem('cart')
            }
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        isMountedRef.current = true
        let cartRef = null

        if (isMountedRef.current) {
            if (isAuth) {
                cartRef = firebase.database.ref(`/cart/${ currentUser.uid }`)
                dispatch(listenCartThunk(cartRef, currentUser.uid, cartListener))
            } else {
                const userCart = storage('cart')
                dispatch(updateCartAC(userCart))
            }
        }

        return () => {
            if (isAuth) {
                cartRef.off('value', cartListener)
                cartRef = null
            }
            isMountedRef.current = false
        }
    }, [isAuth])

    useEffect(() => {
        isMountedRef.current = true
        if (isMountedRef.current) {
            if (!isAuth) {
                storage('cart', cart)
            }
        }

        return () => {
            isMountedRef.current = false
        }
    }, [cart])

    return (
        <div>
            <Router>
                <MuiThemeProvider theme={ theme }>
                    <Navbar/>
                    <Container>
                        { routes }
                    </Container>
                </MuiThemeProvider>
            </Router>
        </div>
    );
}

export default App;
