import {RETURN_TO_CONTACTS, SET_EMAIL, SET_NAME, SET_PHONE, SUBMIT_CONTACTS} from "../actions/OrderActions";

const initialState = {
    step: 0, // 0 - Contact, 1 - Address, 2 - Payment
    contacts: {
        name: null,
        phone: null,
        email: null,
    }
};

export function orderReducer(state = initialState, action) {
    switch (action.type) {

        case SET_NAME:
            return {
                ...state,
                contacts: {
                    ...state.contacts,
                    name: action.payload
                }
            };

        case SET_PHONE:
            return {
                ...state,
                contacts: {
                    ...state.contacts,
                    phone: action.payload
                }
            };

        case SET_EMAIL:
            return {
                ...state,
                contacts: {
                    ...state.contacts,
                    email: action.payload
                }
            };

        case SUBMIT_CONTACTS:
            return {
                ...state,
                step: 1,
            };

        case RETURN_TO_CONTACTS:
            return {
                ...state,
                step: 0,
            };

        default:
            return state;
    }
}