import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from './themeSlice'
import authReducer from "./authSlice";
import taskReducer from "./taskSlice"
import socketReducer from "./socketSlice"

const rootReducer = combineReducers({
    global:themeReducer,
    employee:authReducer,
    tasks:taskReducer,
    socket:socketReducer 
})
export default rootReducer