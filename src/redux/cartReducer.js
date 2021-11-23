import {
    ADD_TO_CART,
    CLEAR_CART_AFTER_LOGOUT, REMOVE_ITEM_FROM_CART, UPDATE_CART
} from './types';
import { Firebase } from '../firebase/firebase';

const firebase = new Firebase()

const initialState = {
    cart: {}
}

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                cart: {
                    ...state.cart,
                    [action.payload.key]: action.payload.product
                }
            }
        case REMOVE_ITEM_FROM_CART:
            const { [action.payload]: _, ...rest } = state.cart
            return {
                ...state,
                cart: rest
            }
        case CLEAR_CART_AFTER_LOGOUT:
            return {
                ...state,
                cart: initialState.cart
            }
        case UPDATE_CART:
            return {
                ...state,
                cart: action.payload
            }
        default:
            return state
    }
}

export const addToCartAC = payload => ({
    type: ADD_TO_CART,
    payload
})

export const removeItemFromCartAC = payload => ({
    type: REMOVE_ITEM_FROM_CART,
    payload
})

export const removeItemFromCartThunk = (uid, key) => async () => {
    const itemRef = firebase.database.ref(`/cart/${uid}/${key}`)

    try {
        await itemRef.remove()
    } catch (e) {
        throw new Error(e.message)
    }
}

export const addToCartThunk = (uid, product) => async () => {
    const userCartRef = firebase.database.ref(`/cart/${ uid }`)

    try {
        await userCartRef.update({
            [product.key]: product.product
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

export const updateCartAC = payload => ({
    type: UPDATE_CART,
    payload
})

export const updateCartThunk = (uid, cart) => async () => {
    const cartRef = firebase.database.ref(`/cart/${uid}`)

    try {
        await cartRef.update(cart)
    } catch (e) {
        throw new Error(e.message)
    }
}

export const clearCartAfterLogout = () => ({ type: CLEAR_CART_AFTER_LOGOUT })

export const listenCartThunk = (cartRef, uid, cartListener) => () => {
    try {
        cartRef.on('value', cartListener)
    } catch (e) {
        throw new Error(e.message)
    }
}