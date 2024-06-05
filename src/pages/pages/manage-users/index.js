// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

// ** Demo Components Imports
import Table from 'src/views/manage-users/Table';
import StatisticsCard from 'src/views/manage-users/StatisticsCard';

const Dashboard = () => {

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
