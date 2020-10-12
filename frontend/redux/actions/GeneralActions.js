export const SET_CART_OPEN = 'SET_CART_OPEN'

export function setCartOpen(open) {
    return dispatch => {
        dispatch({
            type: SET_CART_OPEN,
            payload: open,
        });
    };
}