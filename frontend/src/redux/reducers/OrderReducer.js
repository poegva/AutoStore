import {
    ORDER_SUBMITTED,
    RETURN_TO_CONTACTS,
    SET_ADDRESS,
    SET_DELIVERY_OPTION,
    SET_EMAIL,
    SET_NAME,
    SET_PHONE,
    SUBMIT_CONTACTS,
    SUBMIT_ORDER,
    ADD_ITEM,
    CLEAR_CART, ORDER_LOADED, REMOVE_ITEM, DELETE_ITEM,
    UNSUBMIT_ORDER
} from "../actions/OrderActions";

const initialState = {
    cartTotal: 0,
    cart: {
    },
    step: 0, // 0 - Contact, 1 - Address, 2 - Waiting redirect to payment
    contacts: {
        name: null,
        phone: null,
        email: null,
    },
    address: null,
    deliveryOption: null,
    lastOrderId: null,
    orders: {},
};

function recalculateCartTotal(cart) {
    return Object.values(cart).reduce((acc, current) => acc + current.quantity * current.item.price, 0)
}

export function orderReducer(state = initialState, action) {
    let id;

    switch (action.type) {

        case ADD_ITEM:
            id = action.payload.id;
            const newStep = Object.keys(state.cart).length === 0 ? 0 : state.step

            let newCart = null;
            if (id in state.cart) {
                newCart = {
                    ...state.cart,
                    [id]: {
                        item: action.payload,
                        quantity: state.cart[id].quantity + 1,
                    }
                }
            } else {
                newCart = {
                    ...state.cart,
                    [id]: {
                        item: action.payload,
                        quantity: 1,
                    }
                }
            }

            return {
                ...state,
                cartTotal: recalculateCartTotal(newCart),
                step: newStep,
                cart: newCart,
            }

        case REMOVE_ITEM:
            id = action.payload.id;

            newCart = state.cart;

            if (id in state.cart) {
                if (state.cart[id].quantity === 1) {
                    delete newCart[id];
                } else {
                    newCart = {
                        ...state.cart,
                        [id]: {
                            item: action.payload,
                            quantity: state.cart[id].quantity - 1
                        }
                    }
                }
            }

            return {
                ...state,
                cartTotal: recalculateCartTotal(newCart),
                cart: newCart
            }

        case DELETE_ITEM:
            id = action.payload.id;

            if (id in state.cart) {
                let newCart = {...state.cart};
                const quantity = newCart[id].quantity;
                delete newCart[id];

                return {
                    ...state,
                    cartTotal: recalculateCartTotal(newCart),
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

        case UNSUBMIT_ORDER:
            return {
                ...state,
                step: 1
            }

        case SET_ADDRESS:
            return {
                ...state,
                address: action.payload,
                deliveryOption: null,
            };

        case SUBMIT_ORDER:
            return {
                ...state,
                step: 2,
            };

        case SET_DELIVERY_OPTION:
            return {
                ...state,
                deliveryOption: action.payload
            };

        case ORDER_SUBMITTED:
            console.log(action.payload)
            return {
                ...state,
                cart: {},
                cartTotal: 0,
                lastOrderId: action.payload.id,
                orders: {
                    ...state.orders,
                    [action.payload.id]: action.payload
                },
                deliveryOption: null,
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