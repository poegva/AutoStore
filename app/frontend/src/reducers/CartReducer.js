import {ADD_ITEM, REMOVE_ITEM} from "../actions/CartActions";

const initialState = {
    content: {}
}

export function cartReducer(state = initialState, action) {

    switch(action.type) {
        case ADD_ITEM:
            const id = action.payload.id;
            if (id in state.content) {
                return {
                    ...state,
                    content: {
                        ...state.content,
                        [id]: {
                            item: action.payload,
                            quantity: state.content[id].quantity + 1,
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    content: {
                        ...state.content,
                        [id]: {
                            item: action.payload,
                            quantity: 1,
                        }
                    }
                };
            }

        case REMOVE_ITEM:
            return state;

        default:
            return state;

    }
}