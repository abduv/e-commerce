import { LOGIN, LOGOUT } from './types';
import { Firebase } from '../firebase/firebase'

const firebase = new Firebase()

const initialState = {
    isAuth: false,
    currentUser: {},
    error: null
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                isAuth: true,
                currentUser: action.payload
            }
        case LOGOUT:
            return {
                ...state,
                isAuth: false,
                currentUser: null
            }
        default: return state
    }
}

export const loginAC = user => ({
    type: LOGIN,
    payload: user
})

export const logoutAC = () => ({
    type: LOGOUT
})

export const signOutThunk = () => async dispatch => {
    try {
        await firebase.auth.signOut()
        dispatch(logoutAC())
    } catch (e) {
        throw new Error(e.message)
    }
}