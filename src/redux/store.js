import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './authReducer';
import { productsReducer } from './productsReducer';
import { cartReducer } from './cartReducer';

const reducers = combineReducers({
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer
})

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const enhancer = composeEnhancers(
    applyMiddleware(thunk)
)

export const store = createStore(
    reducers,
    enhancer
)