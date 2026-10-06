import {createSlice} from '@reduxjs/toolkit'

 const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:true,
        error:null,
        registrationLoading:false,
        registrationError:null,
        registrationMessage:null,
        verificationLoading:false,
        verificationError:null,
        verificationMessage:null
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
        setVerificationLoading:(state,action)=>{
            state.verificationLoading=action.payload
        },
        setVerificationError:(state,action)=>{
            state.verificationError=action.payload
        },
        setVerificationMessage:(state,action)=>{
            state.verificationMessage=action.payload
        },
        clearRegistrationFeedback:(state)=>{
            state.registrationError=null
            state.registrationMessage=null
        },
        clearVerificationFeedback:(state)=>{
            state.verificationError=null
            state.verificationMessage=null
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
    setVerificationLoading,
    setVerificationError,
    setVerificationMessage,
    clearRegistrationFeedback,
    clearVerificationFeedback
}=authSlice.actions
export default authSlice.reducer