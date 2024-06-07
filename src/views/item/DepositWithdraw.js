import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import config from 'config.js'; // Ensure this path is correct

// Status Object for Chip Colors
const statusObj = {
  admin: { color: 'primary' },
  developer: { color: 'info' },
  resigned: { color: 'warning' },
  rejected: { color: 'error' },
  professional: { color: 'success' },
};

// Styled Divider component for layout adjustments
const CustomDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const CustomDividerHorizontal = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(-2, 0, 2, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const DepositWithdraw = () => {
  const router = useRouter();
  const { item: selectedItem } = router.query;
  const [depositData, setDepositData] = useState([]);
  const [withdrawData, setWithdrawData] = useState([]);

  const fetchData = async (query) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/datab?${new URLSearchParams({ data: query })}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);

      return [];
    }
  };

  const fetchDepositData = useCallback(async () => {
    try {

      const data = await fetchData("SELECT * FROM updatelog WHERE type = 'ADD' ORDER BY date DESC, time DESC");
      
      const processedData = await Promise.all(
        data.map(async (item) => {
          if (item.product === selectedItem.replace(/"/g, '')) {
            const [productData, userData, locationData] = await Promise.all([
              fetchData(`SELECT product FROM products WHERE product = '${item.product}'`),
              fetchData(`SELECT username, LOWER(role) AS role FROM users WHERE ${item.userid ? `userid = '${item.userid}'` : 'userid IS NULL'}`),
              fetchData(`SELECT * FROM location WHERE ${item.locationid ? `locationid = '${item.locationid}'` : 'locationid IS NULL'}`),
            ]);

            return {
              name: productData[0]?.product || 'Sample',
              amount: item.amount || 0,
              user: userData[0]?.username || 'default',
              role: userData[0]?.role || 'default',
              location: locationData[0]?.address || 'No address',
            };
          }

          return undefined;
        })
      );
      console.log(processedData)
      setDepositData(processedData.filter((item) => item !== undefined));
    } catch (error) {
      console.error('Error fetching deposit data:', error);
    }
  }, [selectedItem]);

  const fetchWithdrawData = useCallback(async () => {
    try {

      const data = await fetchData("SELECT * FROM updatelog WHERE type = 'REMOVE' ORDER BY date DESC, time DESC");
      
      const processedData = await Promise.all(
        data.map(async (item) => {
          if (item.product === selectedItem.replace(/"/g, '')) {
            const [productData, userData, locationData] = await Promise.all([
              fetchData(`SELECT product FROM products WHERE product = '${item.product}'`),
              fetchData(`SELECT username, LOWER(role) AS role FROM users WHERE ${item.userid ? `userid = '${item.userid}'` : 'userid IS NULL'}`),
              fetchData(`SELECT * FROM location WHERE ${item.locationid ? `locationid = '${item.locationid}'` : 'locationid IS NULL'}`),
            ]);

            return {
              name: productData[0]?.product || 'Sample',
              amount: item.amount || 0,
              user: userData[0]?.username || 'default',
              role: userData[0]?.role || 'default',
              location: locationData[0]?.address || 'No address',
            };
          }

          return undefined;
        })
      );
      console.log(processedData)
      setWithdrawData(processedData.filter((item) => item !== undefined));
    } catch (error) {
      console.error('Error fetching withdraw data:', error);
    }
  }, [selectedItem]);

  useEffect(() => {
    const fetchInterval = setInterval(() => {
      fetchDepositData();
      fetchWithdrawData();
    }, 10000);

    return () => clearInterval(fetchInterval);
  }, [fetchDepositData, fetchWithdrawData]);

  return (
    <Paper>
      <Card sx={{ display: 'flex', flexDirection: ['column', 'row'] }}>
        <Box sx={{ width: '100%' }}>
          <CardHeader
            title="Stock In"
            sx={{ pt: 5.5, alignItems: 'center' }}
            titleTypographyProps={{ variant: 'h6', sx: { lineHeight: 1.6, letterSpacing: 0.15 } }}
          />
          <CardContent sx={{ pb: (theme) => `${theme.spacing(5.5)} !important` }}>
            <CustomDividerHorizontal />
            {depositData.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: index !== depositData.length - 1 ? 6 : 0 }}>
                <Box sx={{ ml: 4, width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.75rem' }}>
                      {item.location}
                    </Typography>
                    <Chip
                      label={item.user}
                      color={statusObj[item.role]?.color || 'default'}
                      sx={{ height: 20, fontSize: '0.6rem', textTransform: 'capitalize', '& .MuiChip-label': { fontWeight: 500 } }}
                    />
                  </Box>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main' }}>
                  +{item.amount}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Box>

        <CustomDivider orientation="vertical" flexItem />

        <Box sx={{ width: '100%' }}>
          <CardHeader
            title="Stock Out"
            sx={{ pt: 5.5, alignItems: 'center' }}
            titleTypographyProps={{ variant: 'h6', sx: { lineHeight: 1.6, letterSpacing: 0.15 } }}
          />
          <CardContent sx={{ pb: (theme) => `${theme.spacing(5.5)} !important` }}>
            <CustomDividerHorizontal />
            {withdrawData.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: index !== withdrawData.length - 1 ? 6 : 0 }}>
                <Box sx={{ ml: 4, width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.75rem' }}>
                      {item.location}
                    </Typography>
                    <Chip
                      label={item.user}
                      color={statusObj[item.role]?.color || 'default'}
                      sx={{ height: 20, fontSize: '0.6rem', textTransform: 'capitalize', '& .MuiChip-label': { fontWeight: 500 } }}
                    />
                  </Box>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main' }}>
                  -{item.amount}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Box>
      </Card>
    </Paper>
  );
};

export default DepositWithdraw;
