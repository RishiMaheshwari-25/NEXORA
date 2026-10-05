import {createSlice} from '@reduxjs/toolkit'

 const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:true,
        error:null,
        registrationLoading:false,
        registrationError:null,
        registrationMessage:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        },
        setRegistrationLoading:(state,action)=>{
            state.registrationLoading=action.payload
        },
        setRegistrationError:(state,action)=>{
            state.registrationError=action.payload
        },
        setRegistrationMessage:(state,action)=>{
            state.registrationMessage=action.payload
        },
        clearRegistrationFeedback:(state)=>{
            state.registrationError=null
            state.registrationMessage=null
        }

    }
})
export const {
    setUser,
    setLoading,
    setError,
    setRegistrationLoading,
    setRegistrationError,
    setRegistrationMessage,
    clearRegistrationFeedback
}=authSlice.actions
export default authSlice.reducer