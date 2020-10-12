import {SET_CART_OPEN} from "../actions/GeneralActions";

const initialState = {
    cartOpen: false
}

export function generalReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CART_OPEN:
            return {
                ...state,
                cartOpen: action.payload
            };
        default:
            return state;
    }
}