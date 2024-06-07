// ** React Imports
import { useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { styled, useTheme } from '@mui/material/styles';
import config  from 'config.js';


// ** MUI Imports
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Stack from '@mui/material/Stack'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

import ModalDialog from './ModalDialog';


const fetchData = async (request) => {
  try {
    const query = { data: request };

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
  const [FooterData, setFooterData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');

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
          let existingProduct = acc.find(item => item.name === product.product);
          if (!existingProduct) {
            existingProduct = { name: product.product };
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
            { id: `${location.address}_stock`, label: `Stock`, group:location.address, group_align:'center', minWidth: 50, align: 'right', groupid:location.locationid },
            { id: `${location.address}_price`, label: `Price`, group:location.address, group_align:'center', minWidth: 50, align: 'right', groupid:location.locationid },
          ])
        ];

        const filterData = locationData.map((location) => {
          let pricesum = 0;
          let stocksum = 0;
          productsData.forEach(element => {
            if(element.locationid==location.locationid){
              if (element.saleprice != null){
                 let  temp = parseFloat(element.saleprice) * parseFloat(element.stock);
                 pricesum += temp
              }
              stocksum += parseFloat(element.stock);
            }
          });
          
          return {
            locationAddress: location.address,
            locationStock: stocksum,
            locationPrice: pricesum
          }
        })

        setData(productsData);
        setRows(updatedRows);
        setColumns(dynamicColumns);
        setFooterData(filterData);
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

  const handleonItemClick = (item) => {
    router.push(`/pages/item?item="${item}"`);
  }

  const handlePriceClick = (row, column) => {
    setDialogTitle(row);
    setDialogContent(` ${column}`);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label='sticky table'>
        <caption>
        <Stack direction={"column"} spacing={1} >
          {FooterData.map((location, index) => (
            <Grid container key={index}>
              <Grid item >
                <Grid container spacing={2} columnSpacing={4}>
                  <Grid item >
                    <Typography variant="body2" sx={{fontWeight:500}}>{location.locationAddress}</Typography>
                  </Grid>
                  <Grid item >
                    <Grid container>
                      <Grid item >
                        <Typography variant="body2" sx={{fontWeight:600}}>{'Valuation'.toLocaleUpperCase()}:₹</Typography>
                      </Grid>
                      <Grid item >
                        <Typography variant="body2">{location.locationPrice}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item >
                    <Grid container>
                        <Grid item >
                          <Typography variant="body2" sx={{fontWeight:600}}>{'Stock'.toLocaleUpperCase()}:</Typography>
                        </Grid>
                        <Grid item >
                          <Typography variant="body2">{location.locationStock}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </caption>
          <TableHead>
            <TableRow>
            {columns.map(column => {
              if (column.id==`${column.group}_stock`){
                return (
                  <DividerTableCellHead key={column.id} align={column.align} colSpan={2} sx={{ maxWidth:(column.minWidth-column.minWidth/2), background:theme.palette.primary.main, color:theme.palette.grey[50]}}>
                    {column.group}{}
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
            <TableRow>
              {columns.map(column => (
                <DividerTableCellSubHead  key={column.id} align={column.align} sx={{ minWidth: column.minWidth*1.3, background:theme.palette.primary.main, color:theme.palette.grey[50] }}>
                {column.label}
              </DividerTableCellSubHead>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <TableRow action={handleonItemClick} hover role='checkbox' tabIndex={-1} key={rowIndex}>
                {columns.map(column => {
                  if (column.label=="Price"){
                    const value = row[column.id];
                  
                  return (
                    <DividerTableCell
                    onClick={() => handlePriceClick(row, column.id)}
                     key={column.id} align={column.align}>
                              {value}
                    </DividerTableCell>
                  );
                  }
                  else {
                    const value = row[column.id];
                    
                    return (
                      <DividerTableCell
                      onClick={() => handleonItemClick(row.name)}
                       key={column.id} align={column.align}>
                                {value}
                      </DividerTableCell>
                    );
                  }
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
      <ModalDialog title={dialogTitle} content={dialogContent} open={dialogOpen} onClose={handleCloseDialog}/>
    </Paper>
  );
};

export default TableStickyHeader;