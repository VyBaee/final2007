import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Pagination } from '@mui/material';

// project imports
import Dot from 'components/@extended/Dot';
import EditIcon from '@mui/icons-material/Edit';

import { filterUsers } from '../../../api/user';

// Table head config
const headCells = [
  { id: 'fullname', align: 'left', label: 'Fullname', width: '200px' },
  { id: 'email', align: 'left', label: 'Email', width: '250px' },
  { id: 'role', align: 'left', label: 'Role', width: '100px' },
  { id: 'status', align: 'left', label: 'Status', width: '120px' },
  { id: 'lastLogin', align: 'left', label: 'Last Login', width: '180px' },
  { id: 'actions', align: 'center', label: 'Actions', width: '130px' }
];

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ width: headCell.width }}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Convert status string thành màu
function StatusDot({ status }) {
  let color = 'primary';
  if (status === 'active') color = 'success';
  else if (status === 'pending') color = 'warning';
  else if (status === 'disabled') color = 'error';

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{status}</Typography>
    </Stack>
  );
}

StatusDot.propTypes = { status: PropTypes.string };

export default function OrderTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1); // Bắt đầu từ 1
  const [pageSize] = useState(10);     // 10 bản ghi mỗi trang
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchFilteredUsers = async (pageNumber) => {
    setIsLoading(true);
    try {
      const res = await filterUsers({
        page: pageNumber,  // BE dùng 0-based
        size: pageSize
      });
      setUsers(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Lỗi gọi API filterUsers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredUsers(page);
  }, [page]);

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  // useEffect(() => {
  //   const fetchFilteredUsers = async () => {
  //   try {
  //     const res = await filterUsers({}); // gửi filter rỗng hoặc điều kiện lọc
  //     setUsers(res.data); // CHỈ LẤY `data` MẢNG
  //   } catch (err) {
  //     console.error('Lỗi gọi API filterUsers:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //   fetchFilteredUsers();
  // }, []);


  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table>
          <OrderTableHead />
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              users.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell><Link color="secondary">{row.email}</Link></TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell><StatusDot status={row.status || 'active'} /></TableCell>
                  <TableCell>
                    {row.devices?.[0]?.lastLogin
                      ? new Date(row.devices[0].lastLogin).toLocaleString()
                      : 'Không có'}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() =>
                        window.open(
                          `${import.meta.env.VITE_APP_BASE_NAME}/account/${encodeURIComponent(row.email)}`,
                          '_blank'
                        )
                      }
                    >
                      <EditIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PHÂN TRANG */}
      <Stack alignItems="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(total / pageSize)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </Box>
  );
}
