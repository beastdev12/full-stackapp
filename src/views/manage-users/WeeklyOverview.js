// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { offset } from '@popperjs/core'

const WeeklyOverview = () => {
  // ** Hook
  const theme = useTheme()



  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper, theme.palette.success.main]
    },
    legend: { show: true },
    grid: {
      strokeDashArray: 7,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.primary.main, // Color for stocks
      theme.palette.info.main,    // Color for cost
      theme.palette.info.main,    // Color for cost
      theme.palette.info.main,    // Color for cost
      theme.palette.info.main    // Color for cost
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      //categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tickPlacement: 'on',
      labels: { show: false },

      //axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: [
      {
        show: true,
        tickAmount: 5,
        labels: {
          offsetX: -17,
          formatter: value => `₹${value}`
        }
      },
      {
        tickAmount: 5,
        opposite: true, // Align the second y-axis on the right side
        show: true,
        labels: {
          offsetX: -17,
          formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}`
        }
      }
    ]
  };

  return (
    <Card>
      <CardHeader
        title='Weekly Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
      <ReactApexcharts
  type='bar'
  height={205}
  options={options}
  series={[
    { name: 'stocks', data: [37, 57, 45, 65] }, // Series for stocks
    { name: 'cost', data: [680, 540, 360, 750] } // Series for cost (values are in dollars)
  ]}
/>
        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4 }}>
            45%
          </Typography>
          <Typography variant='body2'>Your sales performance is 45% 😎 better compared to last month</Typography>
        </Box>
        <Button fullWidth variant='contained'>
          Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
