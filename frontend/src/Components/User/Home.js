import React, { useEffect, useState } from 'react'
import {AppBar, Toolbar, Typography, Box, Tabs, Tab, Grid} from '@mui/material'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { AuthActions } from '../store'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
axios.defaults.withCredentials=true

const theme = createTheme();

function Home() {

const [booked,SetBooked]=useState([]);
const [data,setData]=useState([]);
const [modal,setModal]=useState(false);

const getBookedDetails=async()=>{
  await axios.get("http://localhost:5000/api/getBookDetails").then((response)=>{
    SetBooked(response.data.message)
  })
};


useEffect(() => {
   getBookedDetails();
}, [])


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
  };
    
  const toggleModal=()=>{
    setModal(!modal)
    //console.log("form rendered on modal")
   };

   const handleView=async(id)=>{
    // console.log(id)
       await axios.get(`http://localhost:5000/api/showBooked/${id}`).then((response)=>{
       //console.log(response.data.message)
     setData(response.data.message);
     toggleModal();
   })
   };
       
      return (
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

       <h1>BOOKED SLOTS</h1>

       <div>
       <Grid sx={{ flexGrow: 1 ,p:5,display:'flex'}} container>
          <Grid item xs={12}>
            <Grid container sx={{display:'flex'}}>
            {booked.map((item)=>{
          return(
       <Card sx={{mt:5, ml:4, minWidth: 275, backgroundColor:'#33eaff' }}>
      <CardContent>
        
            <div>
            <div>
            <h1>Slot No:{item.slot}</h1>
            <br></br>
            <h3>Company:{item.company}</h3>
            <h3>Email:{item.email}</h3>
            <br></br>
            <h5>Contact No:{item.phno}</h5>
            </div>
<div>

<Button variant="contained" onClick={()=>handleView(item._id)}>View Details</Button>

</div>
</div>
       
        
      </CardContent>
    
    </Card>
       )
      })}
    </Grid>
          </Grid>
        </Grid>
       </div>

       {modal && (
 <div className="modal">
 <div onClick={toggleModal} className='overlay'></div>
 <div className='modal-content' key={data._id}>
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
            Details
          </Typography>
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
            defaultValue={data.name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="address"
            label="Address"
            type="address"
            id="address"
            defaultValue={data.address}
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
            defaultValue={data.city}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="state"
            label="State"
            type="state"
            id="state"
            defaultValue={data.state}
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
            defaultValue={data.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="phno"
            label="Phone No."
            type="phno"
            id="phno"
            defaultValue={data.phno}
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
            defaultValue={data.company}
            
          />
          
         
          <h4>Describe Your Company & Product</h4>
          <textarea 
          name="description" 
          id="description" 
          cols="60" 
          rows="5"
          defaultValue={data.description}
          >

          </textarea>
        
          

         
        </Box>
        
        
      </Box>
    </Container>
  </ThemeProvider>
  

 </div>
   
</div>
   )}
        </div>
      )
}

export default Home;