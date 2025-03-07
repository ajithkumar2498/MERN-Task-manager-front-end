import { createSlice } from "@reduxjs/toolkit"
// import {user} from "../../assets/Data.jsx"

const initialState = {
    user: sessionStorage.getItem("userInfo") 
    ? JSON.parse(sessionStorage.getItem("userInfo")) 
    : null,

    isSidebarOpen:false,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
            setCredentials : (state, action)=>{
                state.user = action.payload
                sessionStorage.setItem("userInfo", JSON.stringify(action.payload))
            },
            logout: (state, action)=>{
                state.user = null
                sessionStorage.removeItem("userInfo")
            },
            setOpenSidebar: (state, action)=>{
                state.isSidebarOpen = action.payload
            },
    }
})

export const {setCredentials, logout, setOpenSidebar} = authSlice.actions

export default authSlice.reducer