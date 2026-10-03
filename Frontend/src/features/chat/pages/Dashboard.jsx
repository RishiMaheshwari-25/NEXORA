import React from 'react'
import {useSelector} from 'react-redux'
import {useEffect} from 'react'
import {useChat} from '../hooks/useChat.js'

const Dashboard = () => {
    const chat=useChat();
    const user=useSelector(state=>state.auth.user);
    console.log("User in dashboard:",user);
    useEffect(()=>{
        chat.initializeSocketConnection();
    },[])
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard
