import React from 'react'
import {useSelector} from 'react-redux'

const Dashboard = () => {
    const user=useSelector(state=>state.auth.user);
    console.log("User in dashboard:",user);
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard
