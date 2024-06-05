// ** react import
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import config  from 'config.js';

// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll';
import { CurrencyInr } from 'mdi-material-ui';

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

// ** Demo Components Imports
import Table from 'src/views/manage-users/Table';
import Name from 'src/views/manage-users/Name';
import TotalEarning from 'src/views/manage-users/TotalEarning';
import StatisticsCard from 'src/views/manage-users/StatisticsCard';
import WeeklyOverview from 'src/views/manage-users/WeeklyOverview';
import DepositWithdraw from 'src/views/manage-users/DepositWithdraw';
import SalesByCountries from 'src/views/manage-users/SalesByCountries';

const Dashboard = () => {
  const router = useRouter();

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4} lg={8}>
          <StatisticsCard />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Table />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Dashboard;
