import React from 'react'
import {useSelector} from "react-redux"
import {useNavigate} from "react-router"
const Protected = ({children}) => {
    const user=useSelector(state=>state.auth.user);
    const loading=useSelector(state=>state.auth.loading);
    const navigate=useNavigate();
    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        return  navigate("/login");
    }
    return children;
  return (
    <div>
    Protected      
    </div>
  )
}

export default Protected
