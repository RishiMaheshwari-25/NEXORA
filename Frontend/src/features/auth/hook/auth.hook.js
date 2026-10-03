import {useDispatch} from 'react-redux'
import {login,register,getMe,resendVerificationEmail} from '../services/auth.api'
import {setUser,setLoading,setError} from '../auth.slice'
export function useAuth(){
    const dispatch=useDispatch()
    const handleRegister=async ({username,email,password})=>{
      
        try{
              dispatch(setLoading(true));
            const data=await register({username,email,password});
            
           
        }catch(error){
           dispatch(setError(error.response.data.message || "Registration failed"));
        }finally{
             dispatch(setLoading(false));
        }
    }
    async function handleLogin({email,password}){
        try{
            dispatch(setLoading(true));
            const data=await login({email,password});
            dispatch(setUser(data.user));
        }catch(err){
            dispatch(setError(err.response.data.message || "Login failed"));
        }finally{
            dispatch(setLoading(false));
        }
    }
    async function handleGetMe(){
        try{
            dispatch(setLoading(true));
            const data=await getMe();
            dispatch(setUser(data.user));
        }catch(err){
            dispatch(setError(err.response.data.message || "Failed to fetch user details"));
    }finally{
        dispatch(setLoading(false));
    }
}
return {handleRegister,handleLogin,handleGetMe}
}

