import { useRef, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import config  from 'config.js';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';  
import Typography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useMediaQuery} from '@mui/material';

import { CurrencyInr } from 'mdi-material-ui'

const DividerHorizontal = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(-2, 0, 2, 0),
  orientation:'horizontal',
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 1),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));


const ModalDialog = ({ title, content, open, onClose, onUpdate}) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const session = sessionStorage.getItem('userSession')

  //** States 
  const [productInputPrice, setProductInputPrice] = useState(title[content.trim()]);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);

  const handleClose = () => {
    if (dialogRef.current) dialogRef.current.close();
    onClose();
  };

  const UpdateProductPrice = () => {
    const addQueryPOST= () => {
      const query = {
        // Define your query parameters here
        data: `Update products set saleprice=${productInputPrice}, previoussaleprice=saleprice, locationid=(select locationid from location where address='${content.trim().split("_price")[0]}'), updatedDate=curDate(), updatedby=(Select userid from users where sessionid='${session}') where product ='${title['name'].trim()}'`,
      };
    
      // Make a POST request to your Express server endpoint
      fetch(`${config.apiBaseUrl}/api/data?${new URLSearchParams(query)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      console.log(query.data)
    }

    const updateQueryPOST= () => {
      const query = {
        // Define your query parameters here
        data: `insert into updatelog(date, time, userid, locationid, type, amount, product) values(curdate(), curTime(), (select distinct(userid) from users where sessionid='${session}'), (select locationid from location where address='${content.trim().split("_price")[0]}'), 'Price', ${productInputPrice}, '${title['name'].trim()}')`,
      };
      
      // Make a POST request to your Express server endpoint
      fetch(`${config.apiBaseUrl}/api/data?${new URLSearchParams(query)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.error);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      console.log(query.data)
    }

    addQueryPOST();
    updateQueryPOST();
  }

  const handleUpdate = () => {
    UpdateProductPrice();
    handleClose();
  };

  if (open && dialogRef.current) {
    dialogRef.current.showModal()
  };

  const handlePriceInputChange = (event) => {
    const input = event.target.value;
    setProductInputPrice(input);
    console.log(productInputPrice)
  }

  return (
    <Dialog onClose={handleClose} open={open}  sx={{ maxWidth: isMobile ? '68%' : '100%', backdropFilter: 'blur(4px)'}}>
      <Box sx={{backdropFilter: 'blur(100px)'}}>
        <DialogTitle 
        >{title['name']}</DialogTitle>
        <DividerHorizontal/>
        <Box container sx={{display:'flex', flexDirection:'row', marginLeft:"1em", marginRight:'1em', marginBottom:'1em'}}>
          <Typography variant='body2' 
          >{'Location:'+' '}</Typography>
          <Typography variant='body2' 
          sx={{fontWeight:500}}
          >{" "+content.split("_price")[0]}</Typography>
        </Box>

        <form noValidate autoComplete='on' onSubmit={e => e.preventDefault()}>
          <TextField
            id="outlined-number"
            label="Set Price"
            type="number"
            defaultValue={title[content.trim()]}
            helperText="Enter Product Price"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  ₹
                </InputAdornment>
              ),
            }}

            sx={{margin:'0.5em', marginLeft:'1em'}}
            value={productInputPrice}
            onChange={handlePriceInputChange}
          />
          <Box sx={{marginLeft:'1em'}}>
            <Button
              variant="outlined"
              color="success"
              sx={{ margin: 2

              }}
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="warning"
              sx={{ margin: 3 }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default ModalDialog;
