// ** react import
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import config  from 'config.js';

// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

// ** Demo Components Imports
import Name from 'src/views/item/Name';
import TotalEarning from 'src/views/item/TotalEarning';
import DepositWithdraw from 'src/views/item/DepositWithdraw';

const fetchData = async (request) => {
  try {

    const query = { data: request };

    const response = await fetch(`${config.apiBaseUrl}:${config.apiBasePort}/api/data?${new URLSearchParams(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

    });

    const jsonData = await response.json();
    
return jsonData;
  } catch (error) {
    console.error('Error fetching data:', error);
    
return null;
  }
};

const Dashboard = () => {

  const router = useRouter();

  const { item } = router.query;

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch all locations
      const locationData = await fetchData("SELECT * FROM location");

      // Fetch products data
      const productsData = await fetchData(`SELECT * FROM products where product='${item.replace(/"/g, '')}'`);

      if (productsData && locationData) {
        setData({ productsData, locationData });
      }
    };

    fetchInitialData();

    const interval = setInterval(fetchInitialData, 20 * 1000); // Fetch data every 20 seconds
    
return () => clearInterval(interval);
  }, [item]);

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4} lg={4}>
          <Name data={data} />
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <TotalEarning data={data} />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <DepositWithdraw data={data} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Dashboard;
