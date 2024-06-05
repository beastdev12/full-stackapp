import { useState, Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'; // Ensure this path is correct

const BlurBackground = styled('div')(({ blur }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: `blur(${blur}px)`,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CenteredCard = styled(Card)({
  position: 'fixed',
  zIndex: 2000,
});

const AddCard = ({ isOpen, onClose }) => (
  <BlurBackground blur={5}>
    <CenteredCard>
      <CardContent>
        {/* AddStockCard Component should be here */}
        Add Stock Component
      </CardContent>
    </CenteredCard>
  </BlurBackground>
);

const RemoveCard = ({ isOpen, onClose }) => (
  <BlurBackground blur={5}>
    <CenteredCard>
      <CardContent>
        {/* RemoveStockCard Component should be here */}
        Remove Stock Component
      </CardContent>
    </CenteredCard>
  </BlurBackground>
);

const Dashboard = () => {
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isRemoveStockOpen, setIsRemoveStockOpen] = useState(false);

  const handleAddStockClick = () => setIsAddStockOpen(true);
  const handleAddStockClose = () => setIsAddStockOpen(false);
  const handleRemoveStockClick = () => setIsRemoveStockOpen(true);
  const handleRemoveStockClose = () => setIsRemoveStockOpen(false);

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} lg={8}>
          {/* StatisticsCard Component should be here */}
          Statistics Card Component
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Button
                fullWidth
                size='large'
                variant='contained'
                color='success'
                sx={{ marginBottom: 2 }}
                onClick={handleRemoveStockClick}
              >
                Sale Stock
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Button
                fullWidth
                size='large'
                variant='contained'
                color='info'
                sx={{ marginBottom: 2 }}
                onClick={handleAddStockClick}
              >
                Purchase Stock
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {isAddStockOpen && (
          <Fragment>
            <AddCard isOpen={isAddStockOpen} onClose={handleAddStockClose} />
          </Fragment>
        )}
        {isRemoveStockOpen && (
          <Fragment>
            <RemoveCard isOpen={isRemoveStockOpen} onClose={handleRemoveStockClose} />
          </Fragment>
        )}
        <Grid item xs={12} md={12} lg={12}>
          {/* TableProducts Component should be here */}
          Table Products Component
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Dashboard;
