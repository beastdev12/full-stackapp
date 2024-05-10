// ** React Imports
import { useState, useEffect, Fragment } from 'react';
const mysql = require('mysql');

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

const connector = (request) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const query = {
      // Define your query parameters here
      data: request,
    };

    // Make a POST request to your Express server endpoint
    fetch(`http://192.168.1.109:3001/api/data?${new URLSearchParams(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length':700
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



const columns = [
  { 
    id: 'name',
    label: 'Product',
    minWidth: 200 // Reduced minWidth for the Product column
  },
  {
    id: 'stock',
    label: 'Stock',
    minWidth: 100,
    align: 'right'
  },
  {
    id: 'costprice',
    label: 'Cost Price',
    minWidth: 100, // Reduced minWidth for the Cost Price column
    align: 'right',
  }
]
function createData(name, code, population, size) {
  const density = population / size

  return { name, code, population, size, density }
}

const statusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' }
}

const TableStickyHeader = () => {
  const data = connector("Select * from products order by product");
  let rows = [];

  if (data && data.length > 0) {
    const [, ...valuesAfterFirstIndex] = data;
    const CostPrices = valuesAfterFirstIndex.map(item => item['costprice']);
    const ProductNames = valuesAfterFirstIndex.map(item => item['Product']);
    const StockCounts = valuesAfterFirstIndex.map(item => item['Stock']);
    const Categories = valuesAfterFirstIndex.map(item => item['category']);
    const updatedDate = valuesAfterFirstIndex.map(item => item['updatedDate']);
    
    rows = CostPrices.map((costPrice, index) => ({
      name: ProductNames[index],
      stock: StockCounts[index],
      date: new Date(updatedDate[index]).toLocaleDateString(),
      locationid: 'location',
      costprice: costPrice,
      category: Categories[index] === undefined || ' ' ? 'default' : Categories[index]
    }));
    //console.log(rows)
  }
    

  // ** States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 1200 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead >
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}> 
                  <Typography variant='h6' sx={{ fontWeight:700}}>{column.label}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id];
                      if (column.id == 'category'){
                        return (
                          <TableCell key={column.id} align={column.align}>
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
                        );
                      }
                      if (column.id == 'name'){
                        return(
                          <TableCell key={column.id} align={column.align}>
                            <Typography variant='h6' sx={{ fontWeight:600}}>{value}</Typography>
                            <Box sx={{ display: 'flex', flexDirection:'row', alignItems: 'left' }}>
                            <Typography variant='caption' sx={{ fontWeight:1000, fontStyle:'bold'}}>{row['locationid']}</Typography>
                            <Chip
                                label={row.category}
                                color={statusObj[row.category]?.color || 'default'} // Check if statusObj[row.category] exists
                                sx={{
                                  height: 24,
                                  fontSize: '0.75rem',
                                  textTransform: 'capitalize',
                                  '& .MuiChip-label': { fontWeight: 500 },
                                  marginLeft:5
                                }}
                              />
                              <Typography variant='caption' sx={{ fontWeight:600, fontStyle:'italic', marginLeft:5}}>{row['date']}</Typography>
                            </Box>
                          </TableCell>
                        )
                      }
                      else{
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      }
                      
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component='div'
        count={rows ? rows.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableStickyHeader
