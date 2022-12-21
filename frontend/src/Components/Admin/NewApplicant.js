import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../User/regForm.css';
import './modal.css';
import Typography from '@mui/material/Typography';






const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const theme = createTheme();

 function NewApplicant() {

const [details,setDetails]=useState([]);
const [data,setData]=useState([]);
const [modal,setModal]=useState(false);
const [process,setProcess]=useState(false)





const getDetails=async()=>{
    axios.get("http://localhost:5000/adminRoute/getDetails").then((result)=>{
        setDetails(result.data.message)
    })
};

const handleView=async(id)=>{
 // console.log(id)
    await axios.get(`http://localhost:5000/adminRoute/showData/${id}`).then((response)=>{
    //console.log(response.data.message)
  setData(response.data.message);
  toggleModal();
})
};

const handleProcess=async(id)=>{
  await axios.put(`http://localhost:5000/adminRoute/processData/${id}`)
    handleProceed();
    getDetails();
  };



const toggleModal=()=>{
 setModal(!modal)
 //console.log("form rendered on modal")
}

const handleProceed=()=>{
  setProcess(!process)
  //console.log("Approve modal rendered")
}



useEffect(() => {
  
    getDetails()
  
 
},[])


  return (
    <div>
    <div>
    <TableContainer sx={{mt:3}} component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Company Name</StyledTableCell>
            <StyledTableCell align="right">Email</StyledTableCell>
            <StyledTableCell align="right">Company Details</StyledTableCell>
            <StyledTableCell align="right">View Details</StyledTableCell>
            <StyledTableCell align="right">Process Request</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
       
            {details.map((item)=>{
                return(
                    <StyledTableRow key={item._id}>
                   
                    <StyledTableCell align="right">{item.companyname}</StyledTableCell>
                    <StyledTableCell align="right">{item.email}</StyledTableCell>
                    <StyledTableCell align="right">{item.description}</StyledTableCell>
                    <StyledTableCell align="right"><Button  variant="contained" onClick={()=>{handleView(item._id)}}>View</Button></StyledTableCell>
                    <StyledTableCell align="right"><Button  variant="contained" onClick={()=>{handleProcess(item._id)}}>Process</Button></StyledTableCell>
                  </StyledTableRow>
                )
            })}
      
        </TableBody>
      </Table>
    </TableContainer>
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
            defaultValue={data.companyname}
            
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


{process && (
 <div className="modal">
 <div onClick={handleProceed} className='overlay'></div>
 <div className='modal-content'>
   <h1>This Request has been Proccessed Successfully!!</h1>
</div>
  </div>
   )}

     
 
    
     
     </div>
  
  
  );
}


export default NewApplicant;