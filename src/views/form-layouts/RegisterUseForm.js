//*** React Imports
import React, { useEffect, useState } from 'react';
import config from 'config.js';

//*** Next Imports
import { useRouter } from 'next/router';

//*** MUI IMPORTS
import {
  Grid, Button, Divider, MenuItem, TextField,
  CardContent, CardActions, FormControl, OutlinedInput, InputLabel,
  InputAdornment, Select, Typography, IconButton
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';

// Custom input for date picker
const CustomInput = React.forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />;
});

const FormLayoutsSeparator = () => {
  const router = useRouter();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: '',
    locationId: [], // Initialize as an array for multiple select
    role: '',
    dateOfBirth: null,
    phoneNo: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [locationIds, setLocationIds] = useState([]); // State to store fetched location IDs

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setFormState((prevState) => ({
      ...prevState,
      dateOfBirth: newDate
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePassword2Visibility = () => {
    setShowPassword2(!showPassword2);
  };

  // Fetch data from API
  const fetchData = async (query) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/data?${new URLSearchParams({ data: query })}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error);

      return []; // Return an empty array on error
    }
  };

  // Fetch and set location IDs
  useEffect(() => {

    const fetchLocationIds = async () => {
      const locations = await fetchData('SELECT * FROM location');
      setLocationIds(locations);

    };
    fetchLocationIds();
  }, []); // Empty dependency array to run only on mount

  // Handle form submission
  const handleSignUpClick = async () => {
    const formatDateForSQL = (date) => {
      const d = new Date(date);

      return d.toISOString().split('T')[0];
    };

    const { email, password, password2, firstName, lastName, locationId, role, dateOfBirth, phoneNo } = formState;
    const sqlDate = formatDateForSQL(dateOfBirth);

    if (password !== password2) {
      alert("Passwords do not match!");

      return;
    }

    const generateUserId = async (role) => {
      const rolePrefix = {
        'Manager': 'mng',
        'Worker': 'wrk',
        'Admin': 'ADM'
      }[role];
      const result = await fetchData(`SELECT RIGHT(userid, 4) AS lastuserno FROM users WHERE role = '${role}' ORDER BY userid DESC LIMIT 1`);
      const lastUserNo = result?.[0]?.lastuserno || '0000';
      const newUserNo = (parseInt(lastUserNo, 10) + 1).toString().padStart(4, '0');

      return `U${rolePrefix}${newUserNo}`;
    };

    const newUserId = await generateUserId(role);

    const requestQuery = `INSERT INTO users(userid, username, role, password, locationid, gmail, dateofbirth, phoneno)
      VALUES('${newUserId}', '${firstName} ${lastName}', '${role}', '${password}', '${locationId}', '${email}', '${sqlDate}', '${phoneNo}')`;

    const result = await fetchData(requestQuery);

    if (result) {
      alert("User created successfully!");
    } else {
      alert("Failed to create user.");
    }
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              1. Account Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              name='email'
              value={formState.email}
              onChange={handleChange}
              placeholder='carterleonard@gmail.com'
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <OutlinedInput
                id='password'
                label='Password'
                name='password'
                value={formState.password}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={togglePasswordVisibility}
                      aria-label='toggle password visibility'
                    >
                      {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor='confirm-password'>Confirm Password</InputLabel>
              <OutlinedInput
                id='confirm-password'
                label='Confirm Password'
                name='password2'
                value={formState.password2}
                onChange={handleChange}
                type={showPassword2 ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={togglePassword2Visibility}
                      aria-label='toggle password visibility'
                    >
                      {showPassword2 ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ marginBottom: 0 }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              2. Personal Info
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label='First Name'
              name='firstName'
              value={formState.firstName}
              onChange={handleChange}
              placeholder='Leonard'
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label='Last Name'
              name='lastName'
              value={formState.lastName}
              onChange={handleChange}
              placeholder='Carter'
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel id='location-select-label'>Location</InputLabel>
              <Select
                multiple
                labelId='location-select-label'
                id='location-select'
                name='locationId'
                value={formState.locationId}
                onChange={handleChange}
                input={<OutlinedInput label='Location' />}
              >
                {locationIds.map((location) => {

                  return(
                  <MenuItem key={location.locationid} value={location.locationid}>
                    {location.address.split(',')[0].trim()}
                  </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel id='role-select-label'>Role</InputLabel>
              <Select
                labelId='role-select-label'
                id='role-select'
                name='role'
                value={formState.role}
                onChange={handleChange}
                input={<OutlinedInput label='Role' />}
              >
                <MenuItem value='Manager'>Manager</MenuItem>
                <MenuItem value='Worker'>Worker</MenuItem>
                <MenuItem value='Admin'>Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={formState.dateOfBirth}
                onChange={handleDateChange}
                renderInput={(params) => <CustomInput {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Phone No.'
              name='phoneNo'
              value={formState.phoneNo}
              onChange={handleChange}
              placeholder='+91-123-456-8790'
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ margin: 0 }} />
      <CardActions>
        <Button
          size='large'
          type='submit'
          sx={{ mr: 2 }}
          variant='contained'
          onClick={handleSignUpClick}
        >
          Sign Up
        </Button>
        <Button size='large' color='secondary' variant='outlined'
        onClick={() => { router.push('/pages/manage-users') }}>
          Cancel
        </Button>
      </CardActions>
    </form>
  );
};

export default FormLayoutsSeparator;
