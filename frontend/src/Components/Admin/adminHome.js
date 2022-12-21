import React, { useState } from 'react'
import {AppBar, Toolbar, Typography, Box, Tabs, Tab} from '@mui/material'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { AuthActions } from '../store'
import NewApplicant from './NewApplicant'
import ProcessedData from './ProcessedData'
import ApprovedData from './ApprovedData'


axios.defaults.withCredentials=true

function AdminHome() {

  const adminIsLoggedIn= useSelector((state)=>state.adminIsLoggedIn)
  const dispatch=useDispatch()

  const sendLogoutReq= async()=>{
     const res =await axios.post("http://localhost:5000/adminRoute/logout",{
      withCredentials:true
     })
     if(res.status === 200){
      return res
     }
     return new Error("Unable to Logout. Please try again!!")
  }

  const handleLogout=()=>{
  sendLogoutReq().then(()=>dispatch(AuthActions.adminlogout()))
  }

  const [tabIndex, setTabIndex] = useState(0);

const handleTabChange = (event, newTabIndex) => {
  setTabIndex(newTabIndex);

  
};
  return (
    <div>
        <AppBar position="sticky">
                <Toolbar><Typography variant="h3">BOOKING APP</Typography></Toolbar>
                <Box sx={{marginLeft:"auto"}}>
                   <Tabs value={tabIndex} onChange={handleTabChange} textColor="inherit">
                    <Tab to="/adminhome" LinkComponent={Link} label="Home"/>
                    <Tab  to="/bookSlot" LinkComponent={Link} label="BookSlot"/>
                    {adminIsLoggedIn && (<Tab onClick={handleLogout} to="/admin" LinkComponent={Link} label="Logout"/>)}
                   </Tabs>
                </Box>
            </AppBar>
           
            <h1>NEW APPLICANTS</h1>
            <NewApplicant/>

            <h1>DATA FOR PROCESSING</h1>
            <ProcessedData/>

            <h1>APPROVED DATA</h1>
            <ApprovedData/>
    </div>
  )
}

export default AdminHome;