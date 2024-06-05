import React, { useState, useEffect } from 'react';
import config from 'config.js';

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
import { ImageMultipleOutline } from 'mdi-material-ui';

const sampleLocations = [];



const RemoveStockCard = ({ isOpen, onClose }) => {
  const Connector = (request) => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const query = {
        // Define your query parameters here
        data: request,
      };
  
      // Make a POST request to your Express server endpoint
      fetch(`${config.apiBaseUrl}:${config.apiBasePort}/api/data?${new URLSearchParams(query)}`, {
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
    // Access the value of "COUNT(product)" property of the first object in the array
    products = dataCallForProducts.map(item => item['product']);
  }
  const dataCallForLocations = Connector('Select locationid from location order by locationid');
  if (dataCallForLocations && dataCallForLocations.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    locations = dataCallForLocations.map(item => item['locationid']);
  }

  const handleProductCheck = () => {
    for ( var i=0; i< products.length; i++){
      if (productInputValue == products[i]){
        console.log(productInputValue);
        
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
        console.log(locationInputValue);
        
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
    setProductSuggestions(filteredSuggestions.slice(0, 5)); // Show top 5 suggestions
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

  const handleLocationSuggestionClick = (suggestion) => {
    setLocationInputValue(suggestion);
    setLocationSuggestions([]);
  };

  const handleAmountInputChange = (event) => {
    const input = event.target.value;
    setAmountInputValue(input);
  };

  const handleCostInputChange = (event) => {
    const input = event.target.value;
    setCostInputValue(input);
  };

  const handleOnAdd = () => {
    
    const session = sessionStorage.getItem('userSession')
    if (handleProductCheck() && amountInputValue && handleLocationCheck()) {
      console.log('entry Removed')
      
      const removeQueryPOST= () => {
        const query = {
          // Define your query parameters here
          data: `Update products set stock=stock-${amountInputValue}, updatedDate=curDate(), updatedby=(Select userid from users where sessionid='${session}') where product ='${productInputValue}' and locationid='${locationInputValue}'`,
        };
      
        // Make a POST request to your Express server endpoint
        fetch(`${config.apiBaseUrl}:${config.apiBasePort}/api/data?${new URLSearchParams(query)}`, {
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
      }

      const updateQueryPOST= () => {
        const query = {
          // Define your query parameters here
          data: `insert into updatelog(date, time, userid, locationid, type, amount, product) values(curdate(), curTime(), (select distinct(userid) from users where sessionid='${session}'), '${locationInputValue}', 'REMOVE', ${amountInputValue}, '${productInputValue}')`,
        };
        
        // Make a POST request to your Express server endpoint
        fetch(`${config.apiBaseUrl}:${config.apiBasePort}/api/data?${new URLSearchParams(query)}`, {
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
      }
  
      removeQueryPOST();
      updateQueryPOST();

      //Connector(`insert into updatelog(date, time, userid, locationid, type, amount, product) values(curdate(), curTime(), (select distinct(userid) from users where session='${session}'), ${locationInputValue}, 'ADD', ${amountInputValue}, '${productInputValue}')`);
      return onClose();
    }
    else if(productInputValue in products){
      console.log('yes')
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
                <InputLabel htmlFor="amount"  id='amount'>Quntity</InputLabel>
                <Input name="amount" id="amount" type="number" aria-describedby="helper-amount" value={amountInputValue} onChange={handleAmountInputChange}/>
                <FormHelperText id="helper-amount">Enter Product Quantity Sold</FormHelperText>
          </FormControl>
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

export default RemoveStockCard;
