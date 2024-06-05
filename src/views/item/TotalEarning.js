import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import config from 'config.js';

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField';

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import MenuDown from 'mdi-material-ui/MenuDown'
import DotsVertical from 'mdi-material-ui/DotsVertical'

const TotalEarning = ({ data }) => {
  //** States
  const [productData, setProductData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [valuation, setValuation] = useState(0);
  const [prevValuation, setPrevValuation] = useState(0);
  const [editing, setEditing] = useState({ field: null, locationId: null });
  const [inputValue, setInputValue] = useState('');

  const router = useRouter();
  const { item } = router.query;

  useEffect(() => {
    const initializeData = () => {
      if (data) {
        const { productsData, locationData } = data;

        if (productsData && locationData) {
          setProductData(productsData);
          setLocationData(locationData);

          let sumValue = 0;
          productsData.forEach(element => {
            sumValue += element.stock * element.saleprice;
          });
          setValuation(sumValue);
          
          let sumPrev = 0;
          productsData.forEach(element => {
            if (element.previoussaleprice) {
              sumPrev += element.stock * element.previoussaleprice;
            }
          });
          setPrevValuation(sumPrev);
        }
      }
    };

    initializeData();
    const interval = setInterval(initializeData, 20 * 1000); // Fetch data every 20 seconds
    return () => clearInterval(interval);
  }, [data]);

  const getProductsByLocationId = (locationId) => {
    return productData.filter(product => product.locationid === locationId);
  };

  const handleEdit = (field, locationId, currentValue) => {
    setEditing({ field, locationId });
    setInputValue(currentValue);
  };

  const handleBlurOrEnter = (field, locationId, value, productsAtLocation) => {
    const valueInt = parseInt(value)
    if (productsAtLocation.length > 0) {
      // Update function logic here
      if (field === 'price') {
        // Call update Price function
        const query ={
          data:`Update products set previoussaleprice=saleprice, saleprice=${valueInt} where product='${productsAtLocation[0].Product}' and locationid='${locationId}'`
        }
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
        console.log(query.data)
      } else if (field === 'stock') {
        // Call update stock function
        const query ={
          data:`Update products set stock=${valueInt} where product='${productsAtLocation[0].Product}' and locationid='${locationId}'`
        }
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
        console.log(query.data)
      }
    } else {
      const session = sessionStorage.getItem('userSession');
      const productName = item.substring(1,(item.length)-1)
      // Insert function logic here
      if (field === 'price') {
        // Call insert price function
        const query ={
          data:`Insert into products(product, saleprice, locationid, UpdatedDate, updatedby) VALUES('${productName}', ${valueInt}, '${locationId}', CurDate(), (Select distinct(userid) from users where sessionid='${session}') )`
        }
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
      } else if (field === 'stock') {
        // Call insert stock function
        const query ={
          data:`Insert into products(product, stock, locationid, UpdatedDate, updatedby) VALUES('${productName}', ${valueInt}, '${locationId}', CurDate(), (Select distinct(userid) from users where sessionid='${session}') )`
        }
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
    }
    setEditing({ field: null, locationId: null });
  };

  const handleKeyPress = (event, field, locationId, productsAtLocation) => {
    if (event.key === 'Enter') {
      handleBlurOrEnter(field, locationId, inputValue, productsAtLocation);
    }
  };

  return (
    <Card>
      <CardHeader
        title='Total Valuation'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(-0.25)} !important` }}>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
            ₹{valuation}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            {
              (((valuation-prevValuation)/valuation) * 100).toFixed(3) >= 0 ? 
              <>
                <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
                  {(((valuation-prevValuation)/valuation) * 100).toFixed(3)}%
                </Typography>
              </>
              : 
              <>
                <MenuDown sx={{ fontSize: '1.875rem', verticalAlign: 'middle', color:'error.main' }} />
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'error.main' }}>
                  {(((valuation-prevValuation)/valuation) * 100).toFixed(3)}%
                </Typography>
              </>
            }
            
          </Box>
        </Box>
        <Typography component='p' variant='caption' sx={{ mb: 10 }}>
          ₹{prevValuation} previously!
        </Typography>
        {locationData.map((item, index) => {
          const productsAtLocation = getProductsByLocationId(item.locationid);
          const price = productsAtLocation.length > 0 ? productsAtLocation[0].saleprice : 0;
          const stock = productsAtLocation.length > 0 ? productsAtLocation[0].stock : 0;

          return (
            <Box
              key={item.locationid}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index !== locationData.length - 1 ? { mb: 4.5 } : {})
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                  {item.address}
                </Typography>
                <Box sx={{ minWidth: 85, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ minWidth: 85, display: 'flex', flexDirection: 'row' }}>
                    <Button onClick={() => handleEdit('price', item.locationid, price)}>
                      {editing.field === 'price' && editing.locationId === item.locationid ? (
                        <TextField
                          type="number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onBlur={() => handleBlurOrEnter('price', item.locationid, inputValue, productsAtLocation)}
                          onKeyDown={(e) => handleKeyPress(e, 'price', item.locationid, productsAtLocation)}
                          autoFocus
                        />
                      ) : (
                        <Typography align={'right'} variant='body2' sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                          {'Price'}: {price}
                        </Typography>
                      )}
                    </Button>
                    <Button onClick={() => handleEdit('stock', item.locationid, stock)}>
                      {editing.field === 'stock' && editing.locationId === item.locationid ? (
                        <TextField
                          type="number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onBlur={() => handleBlurOrEnter('stock', item.locationid, inputValue, productsAtLocation)}
                          onKeyDown={(e) => handleKeyPress(e, 'stock', item.locationid, productsAtLocation)}
                          autoFocus
                        />
                      ) : (
                        <Typography align={'right'} variant='body2' sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                          {'Stock'}: {stock}
                        </Typography>
                      )}
                    </Button>
                  </Box>
                  <LinearProgress color={item.color} value={item.progress} variant='determinate' />
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TotalEarning;
