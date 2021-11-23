import { PRODUCTS_FETCHED, PRODUCTS_TOGGLE_IS_LOADING } from './types';
import { Firebase } from '../firebase/firebase';

const firebase = new Firebase()

const initialState = {
    products: {},
    loading: false
}

export const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCTS_FETCHED:
            return {
                ...state,
                products: action.payload,
                loading: false
            }
        case PRODUCTS_TOGGLE_IS_LOADING:
            return {
                ...state,
                loading: !state.loading
            }
        default: return state
    }
}

export const productsFetchedAC = payload => ({
    type: PRODUCTS_FETCHED,
    payload
})

export const fetchProductsThunk = () => async dispatch => {
    const productsRef = firebase.database.ref('/products')

    try {
        dispatch({ type: PRODUCTS_TOGGLE_IS_LOADING })
        const snapshot = await productsRef.once('value')
        dispatch(productsFetchedAC(snapshot.val()))
    } catch (e) {
        throw new Error(e.message)
    }
}