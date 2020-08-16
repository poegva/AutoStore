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
    CLEAR_CART, ORDER_LOADED, REMOVE_ITEM, DELETE_ITEM
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
    lastOrderId: null,
    orders: {},
};

export function orderReducer(state = initialState, action) {
    let id;

    switch (action.type) {

        case ADD_ITEM:
            id = action.payload.id;

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

        case REMOVE_ITEM:
            id = action.payload.id;

            if (id in state.cart) {
                if (state.cart[id].quantity === 1) {
                    let newCart = {...state.cart};
                    delete newCart[id];

                    return {
                        ...state,
                        cart: newCart
                    }
                } else {
                    return {
                        ...state,
                        cart: {
                            ...state.cart,
                            [id]: {
                                item: action.payload,
                                quantity: state.cart[id].quantity - 1
                            }
                        }
                    }
                }
            }

            return state;

        case DELETE_ITEM:
            id = action.payload.id;

            if (id in state.cart) {
                let newCart = {...state.cart};
                delete newCart[id];

                return {
                    ...state,
                    cart: newCart
                }
            }

            return state;

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
            console.log(action.payload)
            return {
                ...state,
                cart: {},
                lastOrderId: action.payload.id,
                orders: {
                    ...state.orders,
                    [action.payload.id]: action.payload
                }
            };

        case ORDER_LOADED:
            return {
                ...state,
                orders: {
                    ...state.orders,
                    [action.payload.id]: action.payload
                }
            }

        default:
            return state;
    }
}