  // ** React Imports
  import { useState, useEffect } from 'react';
  import config  from 'config.js';

  // ** Next Imports
  import Link from 'next/link'
  import router, { useRouter } from 'next/router'
  import Image from 'next/image';

  // ** MUI Components
  import Box from '@mui/material/Box'
  import Button from '@mui/material/Button'
  import Divider from '@mui/material/Divider'
  import Checkbox from '@mui/material/Checkbox'
  import TextField from '@mui/material/TextField'
  import InputLabel from '@mui/material/InputLabel'
  import Typography from '@mui/material/Typography'
  import IconButton from '@mui/material/IconButton'
  import CardContent from '@mui/material/CardContent'
  import FormControl from '@mui/material/FormControl'
  import OutlinedInput from '@mui/material/OutlinedInput'
  import { styled, useTheme } from '@mui/material/styles'
  import MuiCard from '@mui/material/Card'
  import InputAdornment from '@mui/material/InputAdornment'
  import MuiFormControlLabel from '@mui/material/FormControlLabel'

  // ** Icons Imports
  import Google from 'mdi-material-ui/Google'
  import Github from 'mdi-material-ui/Github'
  import Twitter from 'mdi-material-ui/Twitter'
  import Facebook from 'mdi-material-ui/Facebook'
  import EyeOutline from 'mdi-material-ui/EyeOutline'
  import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

  // ** Configs
  import themeConfig from 'src/configs/themeConfig'

  // ** Layout Import
  import BlankLayout from 'src/@core/layouts/BlankLayout'

  // ** Demo Imports
  import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

  // ** Styled Components
  const Card = styled(MuiCard)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: { width: '28rem' }
  }))

  const LinkStyled = styled('a')(({ theme }) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
  }))

  const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
    '& .MuiFormControlLabel-label': {
      fontSize: '0.875rem',
      color: theme.palette.text.secondary
    }
  }))

  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    return randomString;
  }




  const LoginPage = ( { isAuthenticated, setIsAuthenticated }) => {

    // ** State
    const [values, setValues] = useState({
      password: '',
      showPassword: false
    })
    const [userid, setUserid] = useState('');
    const [isLoginError, setIsLoginError] = useState(false);
    
    // ** Hook
    const theme = useTheme()
    const router = useRouter()

    const handleChange = prop => event => {
      setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowPassword = () => {
      setValues({ ...values, showPassword: !values.showPassword })
    }

    const handleMouseDownPassword = event => {
      event.preventDefault()
    }

    const handleAuthCallback = () => {
      setIsAuthed(true);
    }

    const colObject = {
      color: theme.palette.primary.main,
      colorError: theme.palette.primary.main
    };
    let UserIdFeild = <TextField autoFocus fullWidth id='userid' label='User ID' sx={{ marginBottom: 4}} value={userid} onChange={(e) => setUserid(e.target.value)}/>

    const userSessionCall = (session) => {
      let query = {

        data:`update users set sessionid='${session}', lastlogin=CurDate() where userid = '${userid}'`,
      }
      fetch(`${config.apiBaseUrl}/api/userSession?${new URLSearchParams(query)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log("done");
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    };

    const handleLoginClick = (request, session) => {
      // Fetch data and handle routing
      let query = {
        data: request,
      };
      fetch(`${config.apiBaseUrl}:${config.apiBasePort}/api/auth?${new URLSearchParams(query)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(data[0]['password_matched']);
        var auth = data[0]['password_matched'];
        if (auth == 1){
          query = {
            userSession:session
          }
          setIsAuthenticated(true);
          sessionStorage.setItem('userSession', session);
          userSessionCall(session);
          router.push(`/`);
        }
        else{
          setIsLoginError(true);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    };

    return (
      <Box className='content-center'>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src="/images/icon.svg"
                  alt="Logo"
                  width={40}
                  height={34}
                  style={{ fill: theme.palette.primary.main }}
                />
              <Typography
                variant='h6'
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '1.5rem !important'
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                Welcome to {themeConfig.templateName}! 👋🏻
              </Typography>
              <Typography variant='body2'>Please sign-in to your account!</Typography>
            </Box>
            <form noValidate autoComplete='on' onSubmit={e => e.preventDefault()}>
              <TextField error={isLoginError} autoFocus fullWidth id='userid' label='User ID' sx={{ marginBottom: 4}} value={userid} onChange={(e) => setUserid(e.target.value)}/>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-password' error={isLoginError}>Password</InputLabel>
                <OutlinedInput
                  label='Password'
                  value={values.password}
                  error={isLoginError}
                  id='auth-login-password'
                  onChange={handleChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Box
                sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <FormControlLabel control={<Checkbox />} label='Remember Me' />
                <Link passHref href='/'>
                  <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
                </Link>
              </Box>
              <Button
                fullWidth
                size='large'
                variant='contained'
                sx={{ marginBottom: 5 }}
                onClick={() => {
                  const CreateSession = () => {
                    var session = generateRandomString(14);
                    handleLoginClick(`Select CASE WHEN password = '${values.password}' THEN 1 ELSE 0 END AS password_matched From users Where userid = '${userid}'`, session);
                    console.log(session);
                  }
                  CreateSession();
              }
              }
              >
                Login
              </Button>
              
            </form>
          </CardContent>
        </Card>
        <FooterIllustrationsV1 />
      </Box>
    )
  }
  LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

  export default LoginPage

  /**
   select case when password = 'Rajput@2005' then 1 else 0 end AS passwords from users where userid = 'Udev0012';


   <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ marginRight: 2 }}>
                  New on our platform?
                </Typography>
                <Typography variant='body2'>
                  <Link passHref href='/pages/register'>
                    <LinkStyled>Create an account</LinkStyled>
                  </Link>
                </Typography>
              </Box>
              <Divider sx={{ my: 5 }}>or</Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link href='/' passHref>
                  <IconButton component='a' onClick={e => e.preventDefault()}>
                    <Facebook sx={{ color: '#497ce2' }} />
                  </IconButton>
                </Link>
                <Link href='/' passHref>
                  <IconButton component='a' onClick={e => e.preventDefault()}>
                    <Twitter sx={{ color: '#1da1f2' }} />
                  </IconButton>
                </Link>
                <Link href='/' passHref>
                  <IconButton component='a' onClick={e => e.preventDefault()}>
                    <Github
                      sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                    />
                  </IconButton>
                </Link>
                <Link href='/' passHref>
                  <IconButton component='a' onClick={e => e.preventDefault()}>
                    <Google sx={{ color: '#db4437' }} />
                  </IconButton>
                </Link>
              </Box>
  */
