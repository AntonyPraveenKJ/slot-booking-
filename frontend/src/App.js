import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/User/Login';
import Signup from './Components/User/Signup';
import AdminLogin from './Components/Admin/adminLogin';
import AdminSignup from './Components/Admin/adminSignup';
import { useSelector } from 'react-redux';
import React from 'react';
import Home from './Components/User/Home';
import AdminHome from './Components/Admin/adminHome';
import RegForm from './Components/User/RegForm';
import BookSlot from './Components/Admin/BookSlot';

function App() {
  const userIsLoggedIn=useSelector((state)=>state.userIsLoggedIn);
  const adminIsLoggedIn=useSelector((state)=>state.adminIsLoggedIn);
  console.log(userIsLoggedIn)
  return (
    
    
     
   <React.Fragment>
      <Routes>
         <Route path='/' element={<Login/>}/>
         <Route element={<Signup/>}  path="/signup"/>
         <Route element={<AdminLogin/>} path="/admin"/>
         <Route element={<AdminSignup/>} path="/adminsignup"/>
         <Route element={<RegForm/>} path="/regForm"/>
         <Route element={<BookSlot/>} path="/bookSlot"/>
         {adminIsLoggedIn && <Route element={<AdminHome/>} path="/adminhome"/>}{" "}
         {userIsLoggedIn && <Route element={<Home/>} path="/home"/>}{" "}
      </Routes>
      </React.Fragment>
      
     
    
    
  );
}

export default App;
