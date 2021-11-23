import React, { useState } from 'react'
import {
    makeStyles,
    Typography,
    Toolbar,
    AppBar,
    IconButton,
    Drawer,
    List,
    ListItem, ListItemText, ListItemIcon, Divider
} from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutThunk } from '../redux/authReducer';
import { clearCartAfterLogout } from '../redux/cartReducer';

const useStyles = makeStyles(theme => ({
    link: {
        textDecoration: 'none',
        color: '#fff'
    },
    cart: {
        display: 'flex',
        alignItems: 'center'
    },
    navbar: {
        display: 'flex',
        alignItems: 'center'
    },
    title: {
        flexGrow: 1
    },
    item: {
        '& + &': {
            paddingTop: theme.spacing(1)
        }
    },
    list: {
        minWidth: 200
    },
    toolbar: theme.mixins.toolbar
}))

export const Navbar = () => {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false)
    const cart = useSelector(state => state.cart.cart) || {}
    const authInfo = useSelector(state => state.auth)
    const cartLength = Object.keys(cart).length
    const dispatch = useDispatch()
    const history = useHistory()

    let numberItemsInCart
    if (!cartLength) {
        numberItemsInCart = 'пуста'
    } else if (cartLength === 1) {
        numberItemsInCart = '1 товар'
    } else if (cartLength >= 2 && cartLength <= 4) {
        numberItemsInCart = `${ cartLength } товара`
    } else if (cartLength > 4) {
        numberItemsInCart = `${ cartLength } товаров`
    }

    const logoutHandler = async () => {
        dispatch(signOutThunk())
        dispatch(clearCartAfterLogout())
        history.push('/')
    }

    return (
        <AppBar position="static" color="primary">
            <Toolbar className={ classes.navbar }>
                <div className={ classes.title }>
                    <Link
                        to="/"
                        className={ classes.link }
                    >
                        <Typography variant="h5">
                            E-Commerce
                        </Typography>
                    </Link>
                </div>

                <IconButton onClick={ () => setIsOpen(prev => !prev) }>
                    <MenuIcon fontSize="large"/>
                </IconButton>

                <Drawer
                    anchor="right"
                    open={ isOpen }
                    onClose={ () => setIsOpen(prev => !prev) }
                >
                    <List className={ classes.list }>
                        <div className={ classes.toolbar }/>
                        <Divider/>

                        <ListItem button component={ Link } to="/products" className={ classes.item }>
                            <ListItemText>
                                Продукты
                            </ListItemText>
                        </ListItem>

                        <NavbarAuthButtons
                            authInfo={authInfo}
                            classes={classes}
                            logout={logoutHandler}
                        />

                        <ListItem button component={ Link } to="/cart" className={ `${ classes.item } ${ classes.cart }` }>
                            <ListItemIcon>
                                <ShoppingCartIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                Корзина <br/>
                                { numberItemsInCart }
                            </ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

const NavbarAuthButtons = ({ authInfo: {isAuth, currentUser}, classes, logout }) => {

    if (isAuth) {
        const name = currentUser.displayName?.split(' ')[0]

        return (
            <>
                <ListItem button component={ Link } to="/profile" className={ classes.item }>
                    <ListItemText>
                        { name }
                    </ListItemText>
                </ListItem>

                <ListItem button onClick={logout} className={ classes.item }>
                    <ListItemText>
                        Выйти
                    </ListItemText>
                </ListItem>
            </>
        )
    }

    return (
        <>
            <ListItem button component={ Link } to="/login" className={ classes.item }>
                <ListItemText>
                    Войти
                </ListItemText>
            </ListItem>

            <ListItem button component={ Link } to="/registration" className={ classes.item }>
                <ListItemText>
                    Регистрация
                </ListItemText>
            </ListItem>
        </>
    )
}
