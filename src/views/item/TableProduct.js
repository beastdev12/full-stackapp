import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import config from 'config.js';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const TableStickyHeader = () => {
  const router = useRouter();
  
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch all locations
      const locationData = await fetchData("SELECT * FROM location");
      // Fetch products data
      const productsData = await fetchData("SELECT * FROM products ORDER BY updatedDate DESC, stock DESC");

      if (productsData && locationData) {
        const locationMap = locationData.reduce((acc, loc) => {
          acc[loc.locationid] = loc.address;
          return acc;
        }, {});

        const updatedRows = productsData.reduce((acc, product) => {
          let existingProduct = acc.find(item => item.name === product.Product);
          if (!existingProduct) {
            existingProduct = { name: product.Product };
            acc.push(existingProduct);
          }

          const locationName = locationMap[product.locationid] || 'Unknown Location';
          existingProduct[`${locationName}_stock`] = product.stock;
          existingProduct[`${locationName}_price`] = product.saleprice;

          return acc;
        }, []);

        const dynamicColumns = [
          { id: 'name', label: 'Product', minWidth: 200 },
          ...locationData.flatMap(location => [
            { id: `${location.address}_stock`, label: `Stock`, group:location.address, group_align:'center', minWidth: 50, align: 'right' },
            { id: `${location.address}_price`, label: `Price`, group:location.address, group_align:'center', minWidth: 50, align: 'right' },
          ])
        ];

        setData(productsData);
        setRows(updatedRows);
        setColumns(dynamicColumns);
      }
    };

    fetchInitialData();
    const interval = setInterval(fetchInitialData, 20 * 1000); // Fetch data every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const groupedColumns = columns.reduce((acc, column) => {
    if (column.locationName) {
      if (!acc[column.locationName]) {
        acc[column.locationName] = [];
      }
      acc[column.locationName].push(column);
    } else {
      acc[column.id] = [column];
    }
    return acc;
  }, {});

  const handleonItemClick = () => {
    router.push('/pages/item');
  }


  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
            {columns.map(column => {
              if (column.id==`${column.group}_stock`){
                return (
                  <TableCell key={column.id} align={column.align} colSpan={2} sx={{ minWidth: column.minWidth }}>
                    {column.group}{}
                  </TableCell>
                );
              }
              if(column.id=='name'){
                return (
                  <TableCell key={column.id} align={column.align} sx={{ width: 0 }}>
                    Location
                  </TableCell>
                )
              }
            })}
            </TableRow>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <TableRow action={handleonItemClick} hover role='checkbox' tabIndex={-1} key={rowIndex}>
                {columns.map(column => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableStickyHeader;