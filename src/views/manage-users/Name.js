import { useEffect, useState } from 'react';
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const Trophy = ({ data }) => {
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'
  
  // ** States
  const [productData, setProductData] = useState([]);
  const [stockName, setStockName] = useState('');
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    const InitializeData = async () => {
      if (data) {
        if (data.productsData) {
          const { productsData } = data;
          setProductData(productsData || []);
        }
      }
    };

    InitializeData();
    const interval = setInterval(InitializeData, 20 * 1000); // Fetch data every 20 seconds
    
return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (productData.length > 0) {
      setStockName(productData[0].Product || 'No Product Name');
      
      // ** Calculate Valuation
      let sumStock = 0;
      productData.forEach(element => {
        sumStock += element.stock || 0;
      });
      setTotalStock(sumStock);
    }
  }, [productData]);

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>{stockName}</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          Total Stock
        </Typography>
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
          {totalStock}
        </Typography>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
      </CardContent>
    </Card>
  )
}

export default Trophy
