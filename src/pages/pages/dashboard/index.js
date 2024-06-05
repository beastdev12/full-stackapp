// ** Router imports 
import { useEffect, useState } from 'react'


// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import TableProduct from 'src/views/dashboard/TableProduct'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'

var profit = 45;

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
        <Grid container spacing={6}>
        </Grid>
      </ApexChartWrapper>
    );
  } else {
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
  }
};

export default Dashboard;

/*
<Grid item xs={12} md={2} lg={4}>
          <TotalEarning />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SalesByCountries />
        </Grid>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>



<Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='$2'
                icon={<Poll />}
                color='success'
                trendNumber={profit + "%"} 
                title='Total Profit'
                subtitle='Weekly Profit'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='$78'
                title='Refunds'
                trend='negative'
                color='secondary'
                trendNumber='-15%'
                subtitle='Past Month'
                icon={<CurrencyUsd />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='862'
                trend='negative'
                trendNumber='-18%'
                title='New Project'
                subtitle='Yearly Project'
                icon={<BriefcaseVariantOutline />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='15'
                color='warning'
                trend='negative'
                trendNumber='-18%'
                subtitle='Last Week'
                title='Sales Queries'
                icon={<HelpCircleOutline />}
              />
            </Grid>
          </Grid>
        </Grid>
 */
