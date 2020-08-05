export const SET_NAME = 'SET_NAME'
export const SET_PHONE = 'SET_PHONE'
export const SET_EMAIL = 'SET_EMAIL'
export const SUBMIT_CONTACTS = 'SUBMIT_CONTACTS'
export const RETURN_TO_CONTACTS = 'RETURN_TO_CONTACTS'

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