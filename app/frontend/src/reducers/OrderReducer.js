import {
    ORDER_SUBMITTED,
    RETURN_TO_CONTACTS,
    SET_ADDRESS,
    SET_DELIVERY_SELECTED,
    SET_EMAIL,
    SET_NAME, SET_OPTIONS,
    SET_PHONE,
    SUBMIT_CONTACTS,
    SUBMIT_ORDER,
    ADD_ITEM,
    CLEAR_CART
} from "../actions/OrderActions";

const initialState = {
    cart: {},
    step: 0, // 0 - Contact, 1 - Address, 2 - Waiting redirect to payment
    contacts: {
        name: null,
        phone: null,
        email: null,
    },
    address: null,
    delivery: {
        options: null,
        selected: null
    },
    lastOrder: {
        id: null,
        token: null,
        items: null
    }
};

export function orderReducer(state = initialState, action) {
    switch (action.type) {

        case ADD_ITEM:
            const id = action.payload.id;

            if (id in state.cart) {
                return {
                    ...state,
                    cart: {
                        ...state.cart,
                        [id]: {
                            item: action.payload,
                            quantity: state.cart[id].quantity + 1,
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    step: Object.keys(state.cart).length === 0 ? 0 : state.step,
                    cart: {
                        ...state.cart,
                        [id]: {
                            item: action.payload,
                            quantity: 1,
                        }
                    }
                };
            }

        case CLEAR_CART:
            return {
                ...state,
                cart: {}
            }

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

        case SET_ADDRESS:
            return {
                ...state,
                address: action.payload,
            };

        case SET_OPTIONS:
            return {
                ...state,
                delivery: {
                    ...state.delivery,
                    options: action.payload,
                    selected: null,
                }
            };

        case SUBMIT_ORDER:
            return {
                ...state,
                step: 2,
            };

        case SET_DELIVERY_SELECTED:
            return {
                ...state,
                delivery: {
                    ...state.delivery,
                    selected: action.payload
                }
            };

        case ORDER_SUBMITTED:
            return {
                ...state,
                cart: {},
                lastOrder: {
                    id: action.payload.id,
                    token: action.payload.token,
                    items: null,
                },
            };

        default:
            return state;
    }
}