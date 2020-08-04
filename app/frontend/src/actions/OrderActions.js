export const SET_OPENED = 'SET_OPENED'

export function setOpened(opened) {
    return dispatch => {
        dispatch({
            type: SET_OPENED,
            payload: opened,
        });
    };
}