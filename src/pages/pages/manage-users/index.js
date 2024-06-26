import {useRouter} from 'next/router';

// ** MUI Imports
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import AccountPlus from 'mdi-material-ui/AccountPlus'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

// ** Demo Components Imports
import Table from 'src/views/manage-users/Table';
import StatisticsCard from 'src/views/manage-users/StatisticsCard';

const Dashboard = () => {

  const router = useRouter();

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <StatisticsCard />

        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        <Button hidden={true}
          fullWidth
          variant='contained'
          container
          sx={{justifyContent:'right'}}
          onClick={()=>{router.push('/pages/register')}}
          >
            |<AccountPlus fullWidth
            sx={{marginRight:4, marginLeft:4}}
            />
          </Button>
          <Table />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Dashboard;
