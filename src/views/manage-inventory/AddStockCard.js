import React, { useState, useEffect } from 'react';
import config  from 'config.js';

// ** MUI Imports
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';

const sampleLocations = [];

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];


const AddStockCard = ({ isOpen, onClose }) => {
  const Connector = (request) => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const query = {
        // Define your query parameters here
        data: request,
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
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }, [request]);
  
    return data
  };
  
  const [productAdd, setProductAdd] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [productInputValue, setProductInputValue] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationInputValue, setLocationInputValue] = useState('');
  const [amountInputValue, setAmountInputValue] = useState('');
  const [costInputValue, setCostInputValue] = useState('');
  
  let products = [];
  let locations = [];
  let locationExists = false;
  
  const dataCallForProducts = Connector('Select product from products order by product');
  if (dataCallForProducts && dataCallForProducts.length > 0) {
    
    products = dataCallForProducts.map(item => item['product']);
  }
  const dataCallForLocations = Connector('Select locationid from location order by locationid');
  if (dataCallForLocations && dataCallForLocations.length > 0) {
    
    locations = dataCallForLocations.map(item => item['locationid']);
  }

  const handleProductCheck = () => {
    for ( var i=0; i< products.length; i++){
      if (productInputValue == products[i]){
          
      return true
      }
      else{

        return false
      }
    }
  }

  const handleLocationCheck = () => {
    for ( var i=0; i< locations.length; i++){
      if (locationInputValue == locations[i]){
        
        return true
      }
      else{

        return false
      }
    }
  }
  
  const handleProductInputChange = (event) => {
    const input = event.target.value;
    setProductInputValue(input);

    // Filter suggestions based on input
    const filteredSuggestions = products.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
    );

    // Set suggestions
    setProductSuggestions(filteredSuggestions.slice(0, 5));
  };

  const handleProductSuggestionClick = (suggestion) => {
    setProductInputValue(suggestion);
    setProductSuggestions([]);
  };


  const handleLocationInputChange = (event) => {
    const input = event.target.value;
    setLocationInputValue(input);

    // Filter suggestions based on input
    
    const filteredSuggestions = locations.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
    );

    // Set suggestions
    setLocationSuggestions(filteredSuggestions.slice(0, 5).length > 0 ? filteredSuggestions.slice(0, 5): sampleLocations); // Show top 5 suggestions
  };

  const handleLocationSuggestionClick = (suggestion) => {//
    setLocationInputValue(suggestion);//
    setLocationSuggestions([]);//
  };

  const handleAmountInputChange = (event) => {//
    const input = event.target.value;//
    setAmountInputValue(input);//
  };

  const handleCostInputChange = (event) => {//
    const input = event.target.value;//
    setCostInputValue(input);//
  };

  const handleOnAdd = () => {
    
    const session = sessionStorage.getItem('userSession')
    if (handleProductCheck() && amountInputValue && handleLocationCheck()) {
      
      
      const addQueryPOST= () => {
        const query = {
          
          data: `Update products set stock=${amountInputValue}+stock, updatedDate=curDate(), updatedby=(Select userid from users where sessionid='${session}') where product ='${productInputValue}' and locationid='${locationInputValue}'`,
        };
      
        
        fetch(`${config.apiBaseUrl}/api/data?${new URLSearchParams(query)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(data => {
          
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
        
      }

      const updateQueryPOST= () => {
        const query = {
          
          data: `insert into updatelog(date, time, userid, locationid, type, amount, product) values(curdate(), curTime(), (select distinct(userid) from users where sessionid='${session}'), '${locationInputValue}', 'ADD', ${amountInputValue}, '${productInputValue}')`,
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
          
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
        
      }
  
      addQueryPOST();
      updateQueryPOST();

      return onClose();
    }
    else if(productInputValue in products){
      
    }
    else{
      
      return onClose(); 
    }
  }


  return (
      <CardContent sx={{maxWidth:400}}>
        <form noValidate autoComplete='on' onSubmit={e => e.preventDefault()}>
          <Box id='filterSelect'>
            <TextField
              label="Product"
              fullWidth
              value={productInputValue}
              onChange={handleProductInputChange}
            />
            <Box>
              {productSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => handleProductSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Box>
          </Box>
          <Stack direction={"row"} spacing={2} sx={{marginTop:5}}>
          <FormControl >
                <InputLabel htmlFor="amount"  id='amount'>Quantity</InputLabel>
                <Input name="amount" id="amount" type="number" aria-describedby="helper-amount" value={amountInputValue} onChange={handleAmountInputChange}/>
                <FormHelperText id="helper-amount">Enter Product Quantity Purchased</FormHelperText>
                
          </FormControl>
          {/**  TO BE USE LATER ****
          <TextField
          id="filled-select-currency-native"
          select
          label="Native select"
          defaultValue="EUR"
          SelectProps={{
            native: true,
          }}
          helperText="Please select your currency"
          variant="filled"
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
           */
           }
          </Stack>
        <Box id='filterSelect' marginTop={3}>
            <TextField
              label="Location"
              fullWidth
              value={locationInputValue}
              onChange={handleLocationInputChange}
            />
            <Box>
              {locationSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => handleLocationSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="info"
            sx={{ margin: 2
              
            }}
            onClick={handleOnAdd}
          >
            Confirm
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
  );
};

export default AddStockCard;
