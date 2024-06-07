import { useState, useEffect } from 'react';

const mysql = require('mysql');

import config  from 'config.js';

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



const Connector = (request) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = {
          data: request,
        };

        const response = await fetch(`${config.apiBaseUrl}/api/data?${new URLSearchParams(query)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': 700
          },
        });
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20 *1000); // Fetch data every 20 seconds
    
return () => clearInterval(interval);
  }, [request]);

  return data;
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
  var Average45 = 0;
  var data = null;
  data = Connector('SELECT SUM(stock) AS tStock FROM products WHERE product IS NOT NULL;');
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]["tstock"];
    totalStock = count;
  }
  data = Connector("SELECT SUM(stock *saleprice) AS valuation FROM products WHERE saleprice IS NOT NULL AND stock is not null;");
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]['valuation'];
    Average30 = count;
  }
  data = Connector("SELECT SUM(stock * previoussaleprice) AS valuation FROM products WHERE previoussaleprice IS NOT NULL AND stock is not null;");
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const count = data[0]['valuation'];
    Average45 = count === null ? 0:count;
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
      trend:Average30 > Average45 ? 'negative': 'positive',
      trendNumber:(((Average30-Average45)/(Average45===0? 1:Average45))*100).toFixed(1)+"%"
    }
  ]

  //console.log(test);
  return (
    <Card>
      <CardContent sx={{ pt: theme => `${theme.spacing(3)}  !important`,mb:-2 }}>
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
                        {item.trend === 'negative' ? (
                          <ChevronUp sx={{ color: 'success.main', fontWeight: 600 }} />
                        ) : item.trend === 'positive' ? (
                          <ChevronDown sx={{ color: 'error.main', fontWeight: 600 }} />
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
