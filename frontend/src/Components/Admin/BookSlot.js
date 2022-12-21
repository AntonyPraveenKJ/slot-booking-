import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AuthActions } from "../store";
import './bookModal.css'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


axios.defaults.withCredentials = true;




function BookSlot() {
  
 

  const handleChange = (event) => {
    setCname(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  const handleOpen = () => {
    setOpen(true);
  };



  const [slot, setSlot] = useState([]);
  const [bookslot, setBookslot] = useState(false);
  const [approved, setApproved] = useState([]);
  const [open, setOpen] = useState(false);
  const [cname,setCname]=useState('');
  const [block,setBlock]=useState(false);
  const [slno,setSlno]=useState();
  const [select,setSelect]=useState([]);
  let arr = [];

  const getTrue=async()=>{
    await axios.get("http://localhost:5000/adminRoute/getTrue").then((res)=>{
          setSelect(res.data.message)
    })
  }
 
 console.log(cname, 'company name')
 console.log(slno,'slot number')
  const getApprovedData = async () => {
    await axios
      .get("http://localhost:5000/adminRoute/getApproved")
      .then((response) => {
        setApproved(response.data.message);
      });
  };

  const getSlot = async () => {
    await axios
      .get("http://localhost:5000/adminRoute/getSlot")
      .then((response) => {
        console.log(response.data.message);
        setSlot(response.data.message);
      });
  };

  useEffect(() => {
    getSlot();
    getApprovedData();
    getTrue();
  }, [slot]);

  const showModal = async (item) => {
         if(item.booked === false){
          bookModal();
         }else{
          blockModal();
         }
  };

  const bookModal = () => {
    setBookslot(!bookslot);
  };

  

  

  const blockModal=()=>{
    setBlock(!block)
  }

  const handleSubmit=async()=>{
 const res= await axios.post("http://localhost:5000/adminRoute/slotDetails",{
      company:cname,
      slot:slno
    })
    .catch((err)=>console.log(err))
    const data=await res.data
     return data;  
  };

  

  const assignSlot=(obj)=>{
       setSlno(obj)
  }

  const adminIsLoggedIn = useSelector((state) => state.adminIsLoggedIn);
  const dispatch = useDispatch();

  const sendLogoutReq = async () => {
    const res = await axios.post("http://localhost:5000/adminRoute/logout", {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res;
    }
    return new Error("Unable to Logout. Please try again!!");
  };

  const handleLogout = () => {
    sendLogoutReq().then(() => dispatch(AuthActions.adminlogout()));
  };

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };
  return (
    <div>
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h3">BOOKING APP</Typography>
          </Toolbar>
          <Box sx={{ marginLeft: "auto" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              textColor="inherit"
            >
              <Tab to="/adminhome" LinkComponent={Link} label="Home" />
              <Tab to="/bookSlot" LinkComponent={Link} label="BookSlot" />
              {adminIsLoggedIn && (
                <Tab
                  onClick={handleLogout}
                  to="/admin"
                  LinkComponent={Link}
                  label="Logout"
                />
              )}
            </Tabs>
          </Box>
        </AppBar>
      </div>

      <div>
        <Grid sx={{ flexGrow: 1 }} container>
          <Grid item xs={12}>
            <Grid container justifyContent="start">
              {slot.map((item)=>{
                if(item.booked){
                  arr.push(item.slNo)
                }
               }
              )}
              {slot.map((item) => {
                console.log('iamarray',arr)
              //  colour = {select.includes(item.)}
              console.log("iam",select)
              console.log("iamslot",slot)
              let colour ;
                arr.includes(item.slNo)?colour='red':colour='blue'
                return (
                  <div key={item.slNo}>
               
                  <Box
                      onClick={() => {
                        showModal(item);assignSlot(item.slNo)
                      }}
                     
                      sx={{
                        mt: 5,
                        ml: 5,
                        mr: 5,
                        width: 200,
                        height: 200,
                        backgroundColor:`${colour}`
                        // backgroundColor: "#2c387e",
                        // "&:hover": {
                        //   backgroundColor: "#482880",
                        //   opacity: [0.9, 0.8, 0.7],
                        // },
                      }}
                    >{select.includes('1')?item.slNo:'f'}</Box> 
                    
              
                  </div>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </div>
      <br></br>

{bookslot && (

        
           <div className="modal">
              <div onClick={bookModal} className='overlay'></div>
                   <div className='modal-content'>   
                   <h1>Select company :- </h1> 
                   <br></br>
                   
      <FormControl sx={{ m: 1, minWidth: 200 }} >
        <InputLabel id="demo-controlled-open-select-label">Company</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={cname}
          label="Company"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
       {approved.map((item)=>{
        return(
          <MenuItem value={item.companyname}>{item.companyname}</MenuItem>
        )
       })}   
         
        </Select>
      </FormControl>
      
      <br></br>
      <Box
  m={1}
 //margin
  display="flex"
  justifyContent="flex-end"
  alignItems="flex-end"
 
>
  <Button  variant="contained" color="primary" sx={{ height: 40 }} onClick={()=>{handleSubmit();bookModal()}}>
   BOOK
  </Button>
</Box>
      </div>
      </div>
  
     

) }


{block && (

<div className="modal">
<div onClick={blockModal} className='overlay'></div>
     <div className='modal-content'> 
     <h1>Sorry!!This Slot Is Already Booked!!</h1>
     </div>
     </div>
)}


     
    </div>
  );
}


export default BookSlot;
