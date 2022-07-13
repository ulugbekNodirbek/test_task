import { combineReducers } from "redux";
import { reducers } from './reducer'
export const reducer = combineReducers({
    data: reducers
})