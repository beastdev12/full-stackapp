import { useState, useEffect } from 'react';
import config from 'config.js';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

const fetchData = async (request, setData) => {
  const query = {
    data: request,
  };

  try {
    const response = await fetch(`${config.apiBaseUrl}:${config.apiBasePort}/api/data?${new URLSearchParams(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    setData(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const statusObj = config.rolekey;

const DashboardTable = () => {
  const [userData, setUserData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchData("Select * from users", setUserData);
  }, []);

  useEffect(() => {
    if (userData && userData.length > 0) {
      const rows = userData.map(item => ({
        name: item.username,
        activity: item.lastlogin ? new Date(item.lastlogin).toLocaleDateString() : '',
        role: item.role || '',
      }));

      setTableData(rows);
    }
  }, [userData]);

  const columns = [
    { id: 'name', title: 'Name', minWidth: 200, align: 'left' },
    { id: 'activity', title: 'Last Active', minWidth: 50, align: 'left' },
    { id: 'role', title: 'Role', minWidth: 50, align: 'left' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              {columns.map(item => (
                <TableCell key={item.id} align={item.align} sx={{ minWidth: item.minWidth }}>
                  {item.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow hover role='checkbox' tabIndex={-1} key={row.name}>
                {columns.map(column => {
                  const value = row[column.id];
                  if (column.id === 'name') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Typography variant='title' sx={{ fontWeight: 600 }}>{value}</Typography>
                      </TableCell>
                    );
                  } else if (column.id === 'role') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Chip
                          label={row.role}
                          color={statusObj[row.role]?.color || 'default'}
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
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};

export default DashboardTable;
