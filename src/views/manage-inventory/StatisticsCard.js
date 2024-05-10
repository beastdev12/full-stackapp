import { useState, useEffect } from 'react';
const mysql = require('mysql');

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import { CurrencyInr } from 'mdi-material-ui'



const connector = (request) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const query = {
      // Define your query parameters here
      data: request,
    };

    // Make a POST request to your Express server endpoint
    fetch(`http://192.168.1.109:3001/api/data?${new URLSearchParams(query)}`, {
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
  }, []);

  return data
};



const renderStats = () => {
  return salesData.map((item, index) => (
    <Grid item xs={6} sm={2} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const StatisticsCard = () => {
  var totalStock = 0;
  var Average30 = 0;
  var data = null;
  data = connector('Select Sum(stock) from products where product is not NULL');
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]["Sum(stock)"];
    totalStock = count-1;
  }
  data = connector("Select SUM(stock*costprice) as valuation from products WHERE Price_30_Days != NULL OR Price_30_Days != '' OR Price_30_Days != '' ");
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]['valuation'];
    Average30 = count.toFixed(2);
  }


  const salesData = [
    {
      stats: totalStock,
      title: 'Total Stock',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: "₹"+Average30,
      title: 'Valuation',
      color: 'success',
      icon: <CurrencyInr sx={{ fontSize: '1.75rem' }} />,
    }
  ]
  //console.log(test);
  return (
    <Card>
      <CardHeader
        title='Inventory'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.primary' }}>
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(0)}  !important` }}>
        <Grid container spacing={[3, 0]}>
          {salesData.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  variant='rounded'
                  sx={{
                    mr: 3,
                    width: 44,
                    height: 44,
                    boxShadow: 3,
                    color: 'common.white',
                    backgroundColor: `${item.color}.main`
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box sx={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                  {/* First row */}
                  <Typography variant='caption' sx={{ gridColumn: '1 /span 2', gridRow: '1' }}>{item.title}</Typography>
                
                  {/* Second row */}
                  <Typography variant='h6' >{item.stats}</Typography>
                
                  {/* Second column */}
                  <Box sx={{display: 'flex', alignItems: 'centre' }}>
                    {item.trend && (
                      <>
                        {item.trend === 'positive' ? (
                          <ChevronUp sx={{ color: 'error.main', fontWeight: 600 }} />
                        ) : item.trend === 'negative' ? (
                          <ChevronDown sx={{ color: 'success.main', fontWeight: 600 }} />
                        ) : null}
                        <Typography
                          variant='caption'
                          sx={{
                            fontWeight: 600,
                            lineHeight: 2,
                            color: item.trend === 'positive' ? 'error.main' : 'success.main'
                          }}
                        >{item.trendNumber}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard

/*
<DotsVertical />
*/
