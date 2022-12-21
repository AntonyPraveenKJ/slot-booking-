import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AuthActions } from '../store';

const theme = createTheme();

function Login() {
const navigate = useNavigate();
const dispatch= useDispatch();
const [inputs,setInputs]=useState({
  email:"",
  password:""
});

const handleChange=(e)=>{
  setInputs(prev =>({
    ...prev,
    [e.target.name]: e.target.value
  }))
};

const sendRequest=async()=>{
  const res=await axios
  .post("http://localhost:5000/api/",{
    email:inputs.email,
    password:inputs.password
  })
  .catch((err)=>console.log(err))
  const data=await res.data
  return data;
}

const handleSubmit=(e)=>{
  e.preventDefault();
  //send http request
  sendRequest().then(()=>dispatch(AuthActions.userlogin())).then(()=>navigate('/home'))
}


  
  return (
    <ThemeProvider theme={theme}>
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(online-registration-sign-up-concept-young-woman-signing-login-to-account-huge-smartphone-user-interface-secure-password-194944746.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleSubmit}>
          <Box  sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              value={inputs.email}
              onChange={handleChange}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={inputs.password}
              onChange={handleChange}
              type="password"
              id="password"
              autoComplete="current-password"
            />
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link  variant="body2" onClick={()=>navigate('/signup')}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            
          </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  </ThemeProvider>
  )
}

export default Login