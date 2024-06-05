import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import config  from 'config.js';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import MuiDivider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

const fetchData = async (request) => {
  try {
    
    const query = { 
      data: request };

    const response = await fetch(`${config.apiBaseUrl}/api/data?${new URLSearchParams(query)}`, {
      
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

const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(0, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderLeft: `1px solid ${theme.palette.divider}`
  }
}));

const DividerHorizontal = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(-2, 0, 2, 0),
  orientation:'horizontal',
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 1),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

const DividerTableCell = styled(TableCell)(({ theme }) => ({
  
  borderRight: `1px solid ${theme.palette.divider}`
  
}));

const DividerTableCellHead = styled(TableCell)(({ theme }) => ({
  
  borderRight: `1px solid ${theme.palette.grey[50]}`,
}));

const DividerTableCellSubHead = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.grey[50]}`,
  borderTop: `1px solid ${theme.palette.grey[50]}`
}));

const TableStickyHeader = () => {
  
  const router = useRouter();
  
  const theme = useTheme();
  
  const [data, setData] = useState([]);
  
  const [columns, setColumns] = useState([]);
  
  const [rows, setRows] = useState([]);
  
  const [page, setPage] = useState(0);
  
  const [rowsPerPage, setRowsPerPage] = useState(10);
  

  useEffect(() => {
    
    const fetchInitialData = async () => {
     
      const locationData = await fetchData("SELECT * FROM location");

      
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
    const interval = setInterval(fetchInitialData, 20 * 1000);
    
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
          <TableHead color={theme.palette.primary.main} sx={{backgroundColor:theme.palette.primary}}>
            <TableRow color={theme.palette.primary.main} sx={{backgroundColor:theme.palette.primary}}>
            {columns.map(column => {
              if (column.id==`${column.group}_stock`){
                
                return (
                  <DividerTableCellHead key={column.id} align={column.align} colSpan={2} sx={{ maxWidth:(column.minWidth-column.minWidth/2), background:theme.palette.primary.main, color:theme.palette.grey[50]}}>
                    {column.group}
                  </DividerTableCellHead>
                );
              }
              if(column.id=='name'){
                
                return (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth*1, background:theme.palette.primary.main, color:theme.palette.grey[50], }}>
                    Location
                  </TableCell>
                )
              }
            })}
            </TableRow>
            <TableRow color={theme.palette.primary.main} sx={{backgroundColor:theme.palette.primary}}>
              {columns.map(column => {
                if (column.id =="name"){
                  
                  return (
                    <DividerTableCellSubHead  key={column.id} align={column.align} sx={{ minWidth: column.minWidth*1.3, background:theme.palette.primary.main, color:theme.palette.grey[50] }}>
                      {column.label}
                    </DividerTableCellSubHead>
                  )
                }
                else{
                  
                  return (
                    <DividerTableCellSubHead  key={column.id} align={column.align} sx={{ minWidth: column.minWidth*0.8, background:theme.palette.primary.main, color:theme.palette.grey[50] }}>
                      {column.label}
                    </DividerTableCellSubHead>
                  )
                }
              }
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <TableRow action={handleonItemClick} hover role='checkbox' tabIndex={-1} key={rowIndex}>
                {columns.map(column => {
                  const value = row[column.id];
                  
                  return (
                    <DividerTableCell key={column.id} align={column.align} >
                    {value}
                    </DividerTableCell>
                    
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
