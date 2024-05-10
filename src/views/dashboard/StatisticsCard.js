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
    <Grid item xs={16} sm={3} key={index}>
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
  var Average45 = 0;
  var Average60 = 0;

  var data = null;
  data = connector('Select Sum(stock) from products where product is not NULL');
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]["Sum(stock)"];
    totalStock = count-1;
  }
  data = connector("Select AVG(Price_30_Days) from products WHERE Price_30_Days != NULL OR Price_30_Days != '' OR Price_30_Days != '' ");
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]["AVG(Price_30_Days)"];
    Average30 = count.toFixed(2);
  }
  data = connector("Select AVG(Price_45_Days) from products WHERE Price_45_Days != NULL OR Price_45_Days != '' OR Price_45_Days != '' ");
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]["AVG(Price_45_Days)"];
    Average45 = count.toFixed(2);
  }
  data = connector("Select AVG(Price_60_Days) from products WHERE Price_60_Days != NULL OR Price_60_Days != '' OR Price_60_Days != '' ");
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]["AVG(Price_60_Days)"];
    Average60 = count.toFixed(2);
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
      title: 'Average Price 30 Days',
      color: 'success',
      icon: <CurrencyInr sx={{ fontSize: '1.75rem' }} />,
    },
    {
      stats: "₹"+Average45,
      title: 'Average Price 45 Days',
      color: 'warning',
      icon: <CurrencyInr sx={{ fontSize: '1.75rem' }} />,
      trend: Average45 > Average30 ? 'positive': 'negative',
      trendNumber: (((Average45-Average30)/Average30)*100).toFixed(2)+"%"
    },
    {
      stats: "₹"+Average60,
      title: 'Average Price 60 Days',
      color: 'info',
      icon: <CurrencyInr sx={{ fontSize: '1.75rem' }} />,
      trend:Average60 > Average45 ? 'positive': 'negative',
      trendNumber:(((Average60-Average45)/Average45)*100).toFixed(2)+"%"
    }
  ]
  //console.log(test);
  return (
    <Card>
      <CardHeader
        title='Statistics Card'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total 48.5% growth
            </Box>{' '}
            😎 this month
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
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {salesData.map((item, index) => (
            <Grid item xs={36} sm={3} key={index}>
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
