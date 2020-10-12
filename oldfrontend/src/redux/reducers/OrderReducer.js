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

    switch (action.type) {

        case ADD_ITEM:
            const add_id = action.payload.id;
            const newStep = Object.keys(state.cart).length === 0 ? 0 : state.step

            let newCart = null;
            if (add_id in state.cart) {
                newCart = {
                    ...state.cart,
                    [add_id]: {
                        item: action.payload,
                        quantity: state.cart[add_id].quantity + 1,
                    }
                }
            } else {
                newCart = {
                    ...state.cart,
                    [add_id]: {
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
            const remove_id = action.payload.id;

            let newCart2 = state.cart;

            if (remove_id in state.cart) {
                if (state.cart[remove_id].quantity === 1) {
                    delete newCart[remove_id];
                } else {
                    newCart2 = {
                        ...state.cart,
                        [remove_id]: {
                            item: action.payload,
                            quantity: state.cart[remove_id].quantity - 1
                        }
                    }
                }
            }

            return {
                ...state,
                cartTotal: recalculateCartTotal(newCart2),
                cart: newCart2
            }

        case DELETE_ITEM:
            const delete_id = action.payload.id;

            if (delete_id in state.cart) {
                let newCart = {...state.cart};
                delete newCart[delete_id];

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