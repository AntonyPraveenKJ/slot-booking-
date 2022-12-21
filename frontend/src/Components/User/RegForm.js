import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
//import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './regForm.css'
import axios from 'axios';
import {AppBar, Toolbar, Tabs, Tab} from '@mui/material'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActions } from '../store'


const theme = createTheme();

function RegForm() {
  
  
  const [inputs,setInputs]=useState({
    Cname:"",
    address:"",
    city:"",
    state:"",
    email:"",
    phno:"",
    companyname:"",
    description:""
  });

  const handleChange=(e)=>{
    setInputs(prev=>({
      ...prev,
      [e.target.name] : e.target.value
    }))
  };

  const sendRequest=async()=>{
    const res=await axios
    .post("http://localhost:5000/api/regForm",{
      name:inputs.Cname,
      address:inputs.address,
      city:inputs.city,
      state:inputs.state,
      email:inputs.email,
      phno:inputs.phno,
      companyname:inputs.companyname,
      description:inputs.description
    })
    .catch((err)=>console.log(err));
    const data=await res.data;
    return data
  }


  const handleSubmit=(e)=>{
    e.preventDefault()
    //send http request
     sendRequest().then(()=>{alert('Sucessfully Registered!!')})
  }

  const userIsLoggedIn= useSelector((state)=>state.userIsLoggedIn)
  const dispatch=useDispatch()

  const sendLogoutReq= async()=>{
     const res =await axios.post("http://localhost:5000/api/logout",{
      withCredentials:true
     })
     if(res.status === 200){
      return res
     }
     return new Error("Unable to Logout. Please try again!!")
  }

  const handleLogout=()=>{
  sendLogoutReq().then(()=>dispatch(AuthActions.userlogout()))
  }

  const [tabIndex, setTabIndex] = useState(0);

const handleTabChange = (event, newTabIndex) => {
  setTabIndex(newTabIndex);
}

  return (
  <div>
    <div>
    <div>
            <AppBar position="sticky">
                <Toolbar><Typography variant="h3">BOOKING APP</Typography></Toolbar>
                <Box sx={{marginLeft:"auto"}}>
                   <Tabs value={tabIndex} onChange={handleTabChange} textColor="inherit">
                    <Tab to="/home" LinkComponent={Link} label="Home"/>
                     <Tab to="/regForm" LinkComponent={Link} label="Register"/>
                   {userIsLoggedIn && (<Tab onClick={handleLogout} to="/" LinkComponent={Link} label="Logout"/>)}
                   </Tabs>
                </Box>
            </AppBar>
        </div>
    </div>
    <div>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Registeration Form
          </Typography>
          <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 1 }}>
            <div className="side-by-side">
            <TextField
              margin="normal"
              required
              fullWidth
              id="Cname"
              label="Name"
              name="Cname"
              autoComplete="Cname"
              autoFocus
              value={inputs.Cname}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              label="Address"
              type="address"
              id="address"
              value={inputs.address}
              onChange={handleChange}
            />
            </div>

            <div className="side-by-side">
            <TextField
              margin="normal"
              required
              fullWidth
              id="city"
              label="City"
              name="city"
              autoComplete="city"
              autoFocus
              value={inputs.city}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="state"
              label="State"
              type="state"
              id="state"
              value={inputs.state}
              onChange={handleChange}
            />
            </div>

            <div className="side-by-side">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={inputs.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phno"
              label="Phone No."
              type="phno"
              id="phno"
              value={inputs.phno}
              onChange={handleChange}
            />
            </div>

            
            <TextField
              margin="normal"
              required
              fullWidth
              id="companyname"
              label="Company Name"
              name="companyname"
              autoComplete="companyname"
              autoFocus
              value={inputs.companyname}
              onChange={handleChange}
            />
            
           
            <h4>Describe Your Company & Product</h4>
            <textarea 
            name="description" 
            id="description" 
            cols="60" 
            rows="5"
            value={inputs.description}
            onChange={handleChange}>

            </textarea>
          
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>

           
          </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
    </div>
  );
}

export default RegForm;