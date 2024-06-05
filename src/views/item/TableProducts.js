import React, { useState, useEffect } from 'react';
import config from 'config.js';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

const fetchData = async (request) => {
  try {
    const query = { data: request };

    const response = await fetch(`${config.apiBaseUrl}:${config.apiBasePort}/api/data?${new URLSearchParams(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const jsonData = await response.json();
    
return jsonData;
    console.log(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
    
return null;
  }
};


const columns = [
  { 
    id: 'name',
    label: 'Product',
    minWidth: 200
  },
  {
    id: 'stock',
    label: 'Stock',
    minWidth: 100,
    align: 'right'
  },
  {
    id: 'date',
    label: 'Updated Date',
    minWidth: 170,
    align: 'right',
  }
];

const TableStickyHeader = () => {

  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const fetchInitialData = async () => {
      const productsData = await fetchData("SELECT distinct * FROM products ORDER BY updatedDate DESC, stock DESC");
      if (productsData) {
        const updatedRows = await Promise.all(productsData.map(async (item) => {
          const locationID = item.locationid;
          const locationData = locationID ? await fetchData(`SELECT address FROM location WHERE locationid = '${locationID}'`) : null;
          
return {
            name: item.Product,
            stock: item.Stock,
            date: new Date(item.updatedDate).toLocaleDateString(),
            locationid: locationData && locationData.length > 0 ? locationData[0].address : 'Location not found',
            costprice: item.costprice,
            category: item.category || 'default',
          };
        }));
        setData(productsData);
        setRows(updatedRows);
      }
    };

    fetchInitialData();
    const interval = setInterval(fetchInitialData, 20 * 1000); // Fetch data every 20 seconds
    
return () => clearInterval(interval);
  }, []);

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
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column.id];
                    if (column.id === 'name') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography variant='title' sx={{ fontWeight: 600 }}>{value}</Typography>
                          <Box spacing={2} sx={{ marginRight: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Typography variant='caption' sx={{ fontWeight: 400 }}>{row['locationid']}</Typography>
                            <Chip
                              label={row.category}
                              color={'default'} // Changed from statusObj[row.category]?.color || 'default' to always use 'default'
                              sx={{
                                height: 24,
                                fontSize: '0.75rem',
                                textTransform: 'capitalize',
                                '& .MuiChip-label': { fontWeight: 500 }
                              }}
                            />
                            <Typography variant='caption' sx={{ fontWeight: 400 }}>{row['costprice'] === null ? 'Prices Not found' : '₹' + row['costprice'] + "/-"}</Typography>
                          </Box>
                        </TableCell>
                      );
                    }
                    
return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
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

export default TableStickyHeader;
