import { combineReducers } from 'redux'
import { orderReducer } from './OrderReducer'

export default combineReducers({
    order: orderReducer,
})