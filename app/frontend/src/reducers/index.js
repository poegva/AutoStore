import { combineReducers } from 'redux'
import { cartReducer } from './CartReducer'
import { orderReducer } from './OrderReducer'

export const rootReducer = combineReducers({
    cart: cartReducer,
    order: orderReducer,
})