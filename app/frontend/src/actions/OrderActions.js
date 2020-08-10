export const ADD_ITEM = 'ADD_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const SET_ITEM = 'SET_ITEM'
export const CLEAR_CART = 'CLEAR_CART'
export const SET_NAME = 'SET_NAME'
export const SET_PHONE = 'SET_PHONE'
export const SET_EMAIL = 'SET_EMAIL'
export const SUBMIT_CONTACTS = 'SUBMIT_CONTACTS'
export const RETURN_TO_CONTACTS = 'RETURN_TO_CONTACTS'
export const SET_ADDRESS = 'SET_ADDRESS'
export const SET_OPTIONS = 'SET_OPTIONS'
export const SET_DELIVERY_SELECTED = 'SET_DELIVERY_SELECTED'
export const SUBMIT_ORDER = 'SUBMIT_ORDER'
export const ORDER_SUBMITTED = 'ORDER_SUBMITTED'
export const CLEAR_ORDER = 'CLEAR_ORDER'


export function addItem(item) {
    return dispatch => {
        dispatch({
            type: ADD_ITEM,
            payload: item,
        });
    };
}

export function removeItem(item) {
    return dispatch => {
        dispatch({
            type: REMOVE_ITEM,
            payload: item,
        });
    };
}

export function setItem(item, quantity) {
    return dispatch => {
        dispatch({
            type: ADD_ITEM,
            payload: {
                item: item,
                quantity: quantity,
            },
        });
    };
}

export function clearCart() {
    return dispatch => {
        dispatch({
            type: CLEAR_CART,
        });
    };
}

export function setName(name) {
    return dispatch => {
        dispatch({
            type: SET_NAME,
            payload: name,
        });
    };
}

export function setPhone(phone) {
    return dispatch => {
        dispatch({
            type: SET_PHONE,
            payload: phone,
        });
    };
}

export function setEmail(email) {
    return dispatch => {
        dispatch({
            type: SET_EMAIL,
            payload: email,
        });
    };
}

export function submitContacts() {
    return dispatch => {
        dispatch({
            type: SUBMIT_CONTACTS,
        });
    };
}

export function returnToContacts() {
    return dispatch => {
        dispatch({
            type: RETURN_TO_CONTACTS,
        });
    };
}

export function setAddress(address) {
    return dispatch => {
        dispatch({
            type: SET_ADDRESS,
            payload: address
        });

        if (address && address.addressComponents.some(c => c.kind === "HOUSE")) {
            fetch(`api/delivery/options/?value=${1000}&address=${address.address}`)
                .then(r => r.json())
                .then(result => {
                    dispatch({
                        type: SET_OPTIONS,
                        payload: result
                    });
                });
        }
    }
}

export function setDeliverySelected(selected) {
    return dispatch => {
        dispatch({
            type: SET_DELIVERY_SELECTED,
            payload: selected
        });
    };
}

export function submitOrder(orderData) {
    return dispatch => {
        dispatch({
            type: SUBMIT_ORDER,
        });

        fetch("api/orders/", {
            method: 'post',
            body: JSON.stringify(orderData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(result => result.json())
            .then(result => {
                dispatch({
                    type: ORDER_SUBMITTED,
                    payload: {
                        id: result.order,
                        token: result.token,
                    }
                });

                window.location = result.paymentUrl;
            });
    };
}

export function clearOrder() {
    return dispatch => {
        dispatch({
            type: CLEAR_ORDER,
        });
    };
}