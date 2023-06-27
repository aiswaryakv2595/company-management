import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from './themeSlice'
import authReducer from "./authSlice";

const rootReducer = combineReducers({
    global:themeReducer,
    employee:authReducer 
})
export default rootReducer