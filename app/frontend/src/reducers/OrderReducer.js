import {SET_OPENED} from "../actions/OrderActions";

const initialState = {
    opened: false,
    step: 0, // 0 - Contact, 1 - Address, 2 - Payment
}

export function orderReducer(state = initialState, action) {
    switch (action.type) {
        case SET_OPENED:
            return {
                ...state,
                opened: action.payload,
            };

        default:
            return state;
    }
}