import {useDispatch} from 'react-redux'
import {login,register,getMe,resendVerificationEmail} from '../services/auth.api'
import {
    clearRegistrationFeedback,
    clearVerificationFeedback,
    setRegistrationError,
    setRegistrationLoading,
    setRegistrationMessage,
    setVerificationError,
    setVerificationLoading,
    setVerificationMessage,
    setUser,
    setLoading,
    setError
} from '../auth.slice'

const getRegistrationErrorMessage = error => {
    const responseData = error?.response?.data
    const validationMessage = responseData?.errors?.[0]?.msg

    return validationMessage ||
        responseData?.message ||
        error?.message ||
        "Registration failed. Please try again."
}

const getVerificationErrorMessage = error => {
    const responseData = error?.response?.data
    return responseData?.message ||
        error?.message ||
        "Unable to resend the verification email right now."
}

export function useAuth(){
    const dispatch=useDispatch()
    const handleRegister=async ({username,email,password})=>{
        dispatch(clearRegistrationFeedback())
        dispatch(setRegistrationLoading(true))

        try{
            const data=await register({username,email,password})
            if (!data?.success) {
                throw new Error(data?.message || "Registration could not be completed.")
            }
            dispatch(setRegistrationMessage(data.message || "Your account has been created."))
            return true
        }catch(error){
            dispatch(setRegistrationError(getRegistrationErrorMessage(error)))
            return false
        }finally{
            dispatch(setRegistrationLoading(false))
        }
    }

    async function handleLogin({email,password}){
        try{
            dispatch(setLoading(true));
            const data=await login({email,password});
            dispatch(setUser(data.user));
            return true;
        }catch(err){
            dispatch(setError(err.response?.data?.message || "Login failed"));
            return false;
        }finally{
            dispatch(setLoading(false));
        }
    }

    async function handleResendVerificationEmail({email}){
        dispatch(clearVerificationFeedback())
        dispatch(setVerificationLoading(true))

        try {
            const data = await resendVerificationEmail({ email })
            if (!data?.success) {
                throw new Error(data?.message || 'Unable to resend verification email.')
            }
            dispatch(setVerificationMessage(data.message || 'Verification email sent successfully.'))
            return true
        } catch (error) {
            dispatch(setVerificationError(getVerificationErrorMessage(error)))
            return false
        } finally {
            dispatch(setVerificationLoading(false))
        }
    }

    async function handleGetMe(){
        try{
            dispatch(setLoading(true));
            const data=await getMe();
            dispatch(setUser(data.user));
        }catch(err){
            dispatch(setError(err.response?.data?.message || "Failed to fetch user details"));
    }finally{
        dispatch(setLoading(false));
    }
}
return {
    handleRegister,
    handleLogin,
    handleResendVerificationEmail,
    handleGetMe,
    clearRegistrationFeedback:()=>dispatch(clearRegistrationFeedback()),
    clearVerificationFeedback:()=>dispatch(clearVerificationFeedback())
}
}
