import { Redirect, Route, Switch } from 'react-router';
import { Products } from './pages/Products.Page';
import { Login } from './pages/Login.Page';
import { Registration } from './pages/Registration.Page';
import { Profile } from './pages/Profile.Page';
import { ProductItem } from './pages/ProductItem.Page';
import { Cart } from './pages/Cart.Page';

export const useRoutes = (isAuth) => {
    return (
        <Switch>

            <Redirect from="/" to="/products" exact/>

            <Route path="/products">
                <Products/>
            </Route>

            <Route path="/product/:id">
                <ProductItem />
            </Route>

            <Route path="/login">
                <Login/>
            </Route>

            <Route path="/registration">
                <Registration/>
            </Route>

            <Route path="/cart">
                <Cart />
            </Route>

            { isAuth ? (
                <Route path="/profile">
                    <Profile />
                </Route>
            ) : null}

            <Route path="*">
                <h1>404 Not Found</h1>
            </Route>

        </Switch>
    )
}