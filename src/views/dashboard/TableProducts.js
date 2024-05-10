// ** React Imports
import { useState, useEffect } from 'react';
const mysql = require('mysql');

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Chip from '@mui/material/Chip'
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
  },
  {
    id: 'locationid',
    label: 'Location ID',
    minWidth: 130,
  },
  {
    id: 'costprice',
    label: 'Cost Price',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'category',
    label: 'Category',
    minWidth: 120,
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
  const data = connector("Select * from products order by stock desc");
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
      locationid: '',
      costprice: costPrice,
      category: Categories[index] === undefined ? '' : Categories[index]
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
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
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
