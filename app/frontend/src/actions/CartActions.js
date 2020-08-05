export const ADD_ITEM = 'ADD_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const SET_ITEM = 'SET_ITEM'

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