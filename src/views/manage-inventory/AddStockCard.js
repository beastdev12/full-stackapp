import { useState, useEffect } from 'react';
const mysql = require('mysql');

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import MuiCard from '@mui/material/Card'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import { styled, useTheme } from '@mui/material/styles'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

  // ** Configs
  import themeConfig from 'src/configs/themeConfig'

  // ** Layout Import
  import BlankLayout from 'src/@core/layouts/BlankLayout'

  // ** Demo Imports
  import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
  import { route } from 'next/dist/server/router';

  // ** Styled Components


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

const CenteredCard = styled(Card)({
  position: 'relative',
});

const StatisticsCard = ( {isOpen, onClose}) => {
  const [userid, setUserid] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  
  var UserIdFeild = <TextField autoFocus fullWidth id='userid' label='Product ID' sx={{ marginBottom: 4}} value={userid} onChange={(e) => setUserid(e.target.value)}/>
  
  return (
    <Card
    alignItems={'center'}
    sx={{justifyContent:'center'}}
    >
      <CardContent sx={{ pt: theme => `${theme.spacing(1)}  !important` }}>
      <form noValidate autoComplete='on' onSubmit={e => e.preventDefault()}>
        {UserIdFeild}
        <FormControl>
          <InputLabel htmlFor="my-input">Email address</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
            <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
        </FormControl>
        <FormControl fullWidth>
          <Select
            value={selectedOption}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select an option' }}
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
            <MenuItem value="option3">Option 3</MenuItem>
          </Select>
        </FormControl>

        <Button
              variant="outlined"
              color="success"
              sx={{ margin: 2 }}
              onClick={onClose}
            >
              Add
            </Button>
        <Button
              variant="outlined"
              color="warning"
              sx={{ margin: 3 }}
              onClick={onClose}
            >
              Cancel
            </Button>
      </form>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
