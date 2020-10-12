import { combineReducers } from 'redux'
import { orderReducer } from './OrderReducer'
import {generalReducer} from "./GeneralReducer";

export default combineReducers({
    order: orderReducer,
    general: generalReducer
})