import {configureStore, createSlice} from '@reduxjs/toolkit'

const AuthSlice=createSlice({
    name:'Auth',
    initialState:{userIsLoggedIn:false,adminIsLoggedIn:false},
    reducers:{
        userlogin(state){
            state.userIsLoggedIn=true
        },
        userlogout(state){
            state.userIsLoggedIn=false
        },
        adminlogin(state){
            state.adminIsLoggedIn=true
        },
        adminlogout(state){
            state.adminIsLoggedIn=false
        }
    }
});

export const AuthActions=AuthSlice.actions;

export const Store=configureStore({
    reducer:AuthSlice.reducer
})