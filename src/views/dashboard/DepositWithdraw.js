import React, { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import config  from 'config.js';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import MuiDivider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { styled, theme } from '@mui/material/styles';

const statusObj = {
  admin: { color: 'primary' },
  developer: { color: 'info' },
  professional: { color: 'success' },
  resigned: { color: 'warning' },
  rejected: { color: 'error' }
}

// Styled Divider component
const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`
  }//
}));

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

const DepositWithdraw = () => {
  

  const theme= useTheme();

  const [depositData, setDepositData] = useState([]);

  const [withdrawData, setWithdrawData] = useState([]);

  const fetchData = async (query) => {
    try {

      const response = await fetch(`${config.apiBaseUrl}/api/data?${new URLSearchParams({ data: query })}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      
    return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchDepositData = async () => {

      try {
        const data = await fetchData("SELECT * from updatelog where type = 'ADD' order by date desc");

        const processedData = await Promise.all(data.map(async (item) => {

          const productData = await fetchData(`SELECT product FROM products WHERE product = '${item.product}'`);
          const UserData = await fetchData(`SELECT username, LOWER(role) AS role FROM users WHERE ${item.userid ? `userid = '${item.userid}'` : 'userid IS NULL'}`);
          const LocationData = await fetchData(`SELECT * FROM location WHERE ${item.locationid ? `locationid = '${item.locationid}'` : 'locationid IS NULL'}`);
          
      return {
            name: productData[0]?.product || 'Sample',
            amount: item.amount,
            user: UserData[0]?.username || 'default',
            role: UserData[0]?.role || 'default',
            location: LocationData[0]?.address || 'No address'
          };
        }));

        setDepositData(processedData);

      } catch (error) {

        console.error('Error fetching deposit data:', error);
      }
    };

    const fetchWithdrawData = async () => {

      try {

        const data = await fetchData("SELECT * FROM updatelog WHERE type = 'REMOVE' order by date desc, time desc");

        const processedData = await Promise.all(data.map(async (item) => {

          const productData = await fetchData(`SELECT product FROM products WHERE product = '${item.product}'`);
          const UserData = await fetchData(`SELECT username, LOWER(role) AS role FROM users WHERE ${item.userid ? `userid = '${item.userid}'` : 'userid IS NULL'}`);
          const LocationData = await fetchData(`SELECT * FROM location WHERE ${item.locationid ? `locationid = '${item.locationid}'` : 'locationid IS NULL'}`);
          
      return {
            name: productData[0]?.product || 'Sample',
            amount: item.amount,
            user: UserData[0]?.username || 'default',
            role: UserData[0]?.role || 'default',
            location: LocationData[0]?.address || 'No address'
          };
        }));

        setWithdrawData(processedData);

      } catch (error) {

        console.error('Error fetching withdraw data:', error);
      }
    };

    const depositTimer = setInterval(async () => {

      await fetchDepositData();
      await fetchWithdrawData();
      
    }, 10 * 1000);

    // Cleanup
    return () => clearInterval(depositTimer);
  }, []);

  return (
    <Paper>
      <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title={'Stock In'}
          backgroundColor={'default'}
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          <DividerHorizontal/>
          {depositData.map((item, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', mb: index !== depositData.length - 1 ? 6 : 0 }}
            >
              <Box
                sx={{
                  ml: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</Typography>
                  <Box sx={{ disply:'flex', flexDirection:'column'}}>
                  <Typography variant='body2' sx={{ fontWeight: 400, fontSize: '0.75rem' }}>{item.location}</Typography>
                  <Chip
                    label={item.user}
                    color={statusObj[item.role]?.color || 'default'}
                    sx={{
                      height: 20,
                      fontSize: '0.6rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  </Box>
                </Box>
                <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'success.main' }}>
                  +{item.amount}
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Box>

      <Divider flexItem />

      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Stock Out'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          <DividerHorizontal/>
          {withdrawData.map((item, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', mb: index !== withdrawData.length - 1 ? 6 : 0 }}
            >
              <Box
                sx={{
                  ml: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</Typography>
                  <Box sx={{ disply:'flex', flexDirection:'column'}}>
                  <Typography variant='body2' sx={{ fontWeight: 400, fontSize: '0.75rem' }}>{item.location}</Typography>
                  <Chip
                    label={item.user}
                    color={statusObj[item.role]?.color || 'default'}
                    sx={{
                      height: 20,
                      fontSize: '0.6rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  </Box>
                </Box>
                <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'error.main' }}>
                  -{item.amount}
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Box>
    </Card>
    </Paper>
    
  );
}

export default DepositWithdraw;
