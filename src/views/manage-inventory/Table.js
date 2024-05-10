import { useState, useEffect } from 'react';
const mysql = require('mysql');

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

const connector = (request) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const query = {
      // Define your query parameters here
      data: request,
    };

    // Make a POST request to your Express server endpoint
    fetch(`http://localhost:3001/api/data?${new URLSearchParams(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setData(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  return data
};


const rows = [
  {
    age: 27,
    status: 'current',
    date: '09/27/2018',
    name: 'Sally Quinn',
    salary: '$19586.23',
    email: 'eebsworth2m@sbwire.com',
    designation: 'Human Resources Assistant'
  },
]

const statusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' }
}

const DashboardTable = () => {
  const data = connector("Select * from products");
  if (data && data.length > 0) {
    // Access the value of "COUNT(product)" property of the first object in the array
    const [, ...valuesAfterFirstIndex] = data;
    const CostPrices = valuesAfterFirstIndex.map(item => item['Price_30_Days']);
    const ProductNames = valuesAfterFirstIndex.map(item => item['Product']);
    const StockCounts = valuesAfterFirstIndex.map(item => item['Stock']);
    const Categories = valuesAfterFirstIndex.map(item => item['category']);
    
    // Create an array of objects combining the selected data
    const rows = CostPrices.map((costPrice, index) => ({
      name: ProductNames[index], // Product Name
      email: StockCounts[index], // Stock count
      date: new Date().toLocaleDateString(), // Date Updated (just an example, you can replace it with actual date)
      salary: '', // Placeholder for Location ID
      age: costPrice, // Cost Price
      category:  (Categories[index] === undefined) ? '' : Categories[index]// Category
    }));
    
    return (
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Stock count</TableCell>
                <TableCell>Date Updated</TableCell>
                <TableCell>Location ID</TableCell>
                <TableCell>Cost Price</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.salary}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.category}
                      color={statusObj[row.category]?.color || 'default'} // Check if statusObj[row.category] exists
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  } else {
    return null; // or any loading indicator if needed
  }
}

export default DashboardTable
