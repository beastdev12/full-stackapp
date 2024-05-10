// ** React Imports
import { useState, useEffect, Fragment } from 'react';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsHorizontalComponent from 'src/@core/components/card-statistics/cards-stats-horizontal'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/manage-inventory/Table'
import TableProducts from 'src/views/manage-inventory/TableProducts'
import Trophy from 'src/views/manage-inventory/Trophy'
import TotalEarning from 'src/views/manage-inventory/TotalEarning'
import StatisticsCard from 'src/views/manage-inventory/StatisticsCard'
import AddStockCard from 'src/views/manage-inventory/AddStockCard'
import RemoveStockCard from 'src/views/manage-inventory/RemoveStockCard'


const BlurBackground = styled('div')(({ theme, blur }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
  backdropFilter: `blur(${blur}px)`, // Apply blur effect
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CenteredCard = styled(Card)({
  position: 'relative',
});

const AddCard = ({ isOpen, onClose }) => {
  return (
    <BlurBackground blur={5}>
      <CenteredCard>
        <CardContent>
          <CenteredCard>
          <AddStockCard isOpen={isOpen} onClose={onClose}/>
          </CenteredCard>
        </CardContent>
      </CenteredCard>
    </BlurBackground>
  );
};


const Dashboard = () => {
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);

  const handleAddStockClick = () => {
    setIsAddStockOpen(true);
  };

  const handleAddStockClose = () => {
    setIsAddStockOpen(false);
  };

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} lg={8}>
          <StatisticsCard />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="success"
              sx={{ marginBottom: 2 }}
              onClick={handleAddStockClick}
            >
              Add Stock
            </Button>
          </Grid>
            <Grid item xs={12} md={5}>
              <Button
              fullWidth
              size='large'
              variant='contained'
              color='error'
              sx={{ marginBottom: 2}}
              onClick={() => {}}
              >
                Remove Stock
              </Button>
            </Grid>
          </Grid>
        </Grid>
       
        {isAddStockOpen && (
            <Fragment>
                    <AddCard isOpen={isAddStockOpen} onClose={handleAddStockClose} />
            </Fragment>
            )}
        
        <Grid item xs={34} md={12} lg={12}>
          <TableProducts />
        </Grid>
        <Grid item xs={12} md={2} lg={4}>
          <TotalEarning />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard

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




 */
