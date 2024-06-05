import { useState, useEffect } from 'react';
import config from 'config.js';

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const fetchData = async (request, setData) => {
  const query = {
    data: request,
  };

  try {
    const response = await fetch(`${config.apiBaseUrl}:${config.apiBasePort}/api/data?${new URLSearchParams(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    setData(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const StatisticsCard = () => {
  const [userData, setUserData] = useState([]);
  const [renderData, setRenderData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchData("Select count(*),role from users group by role", setUserData);
    }
    fetchInitialData();
    const interval = setInterval(fetchInitialData, 20 * 1000); // Fetch data every 20 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userData && userData.length > 0) {
      const stats = userData.map((data, index) => ({
        id: index,
        value: data['count(*)'],
        title: data['role']
      }));
      setRenderData(stats);
    }
  }, [userData]);

  const renderStats = () => {
    return renderData.map((item, index) => (
      <Grid item xs={12} sm={4} key={index}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,  
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${config.rolekey[item.title]?.color || 'default'}.main`
            }}
          >
            {config.rolekey[item.title]?.icon || item.title.slice(0, 1)}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.value}</Typography>
          </Box>
        </Box>
      </Grid>
    ));
  }

  return (
    <Card>
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important`, marginTop: 1 }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StatisticsCard;
