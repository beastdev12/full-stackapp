import { useEffect, useState } from 'react';

// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

// Example of dynamic import
import dynamic from 'next/dynamic';

const TableProduct = dynamic(() => import('src/views/dashboard/TableProduct'), {
  ssr: false,
});

const StatisticsCard = dynamic(() => import('src/views/dashboard/StatisticsCard'), {
  ssr: false,
});

const DepositWithdraw = dynamic(() => import('src/views/dashboard/DepositWithdraw'), {
  ssr: false,
});


import CircularProgress from '@mui/material/CircularProgress';

const Dashboard = () => {
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {

    // Access sessionStorage only on the client side
    const session = sessionStorage.getItem('userSession');
    setUserSession(session);
  }, []);

  if (!userSession) {
    return (
      <ApexChartWrapper>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Grid>
      </ApexChartWrapper>
    );
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={2.2}>
          <StatisticsCard />
        </Grid>
        <Grid item xs={12} md={12} lg={9.8}>
          <DepositWithdraw />
        </Grid>
        <Grid item xs={12}>
          <TableProduct />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Dashboard;
