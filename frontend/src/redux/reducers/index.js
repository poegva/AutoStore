import { combineReducers } from 'redux'
import { orderReducer } from './OrderReducer'

export const rootReducer = combineReducers({
    order: orderReducer,
})