import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| USER STATISTIC COLUMN CHART ||============================== //

export default function UserStatisticChart() {
  const theme = useTheme();
  
  // State để lưu dữ liệu từ API
  const [userStatistic, setUserStatistic] = useState([]);
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
  const [error, setError] = useState(null); // State để theo dõi lỗi khi gọi API

  // state để điều khiển hiển thị của các checkbox
  const [showActiveUsers, setShowActiveUsers] = useState(true);
  const [showTotalUsers, setShowTotalUsers] = useState(true);
  const [showMale, setShowMale] = useState(true);
  const [showFemale, setShowFemale] = useState(true);

  // API endpoint
  const apiEndpoint = 'http://192.168.86.120:8080/api/v1/user-statistics'; // URL của API

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await axios.get(apiEndpoint); // Gửi yêu cầu GET đến API
        setUserStatistic(response.data); // Lưu dữ liệu vào state
      } catch (err) {
        setError(err.message); // Lưu lỗi nếu có
      } finally {
        setLoading(false); // Khi dữ liệu đã tải xong, đổi trạng thái loading
      }
    };

    fetchUserStatistics(); // Gọi hàm fetch khi component mount
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>; // Hiển thị loading khi đang tải dữ liệu
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>; // Hiển thị lỗi nếu có
  }

  // Hàm định dạng giá trị cho các axis
  const valueFormatter = (value) => `${value} người dùng`;
  
  // Lấy dữ liệu người dùng
  const labels = userStatistic.map((item) => item.name);
  const activeUsersData = userStatistic.map((item) => item.activeUsers);
  const totalUsersData = userStatistic.map((item) => item.totalUsers);
  const maleData = userStatistic.map((item) => item.male);
  const femaleData = userStatistic.map((item) => item.female);

  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;
  const warningColor = theme.palette.warning.main;
  const errorColor = theme.palette.error.main;

  const data = [
    { data: activeUsersData, label: 'Người dùng đang hoạt động', color: primaryColor, valueFormatter },
    { data: totalUsersData, label: 'Tổng người dùng', color: successColor, valueFormatter },
    { data: maleData, label: 'Nam', color: warningColor, valueFormatter },
    { data: femaleData, label: 'Nữ', color: errorColor, valueFormatter },
  ];

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4">
              {userStatistic.reduce((acc, cur) => acc + cur.totalUsers, 0)} người dùng
            </Typography>
          </Box>

          <FormGroup>
            <Stack direction="row">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showActiveUsers}
                    onChange={() => setShowActiveUsers(!showActiveUsers)}
                    sx={{
                      '&.Mui-checked': { color: primaryColor }
                    }}
                  />
                }
                label="Người dùng đang hoạt động"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showTotalUsers}
                    onChange={() => setShowTotalUsers(!showTotalUsers)}
                    sx={{
                      '&.Mui-checked': { color: successColor }
                    }}
                  />
                }
                label="Tổng người dùng"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showMale}
                    onChange={() => setShowMale(!showMale)}
                    sx={{
                      '&.Mui-checked': { color: warningColor }
                    }}
                  />
                }
                label="Nam"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showFemale}
                    onChange={() => setShowFemale(!showFemale)}
                    sx={{
                      '&.Mui-checked': { color: errorColor }
                    }}
                  />
                }
                label="Nữ"
              />
            </Stack>
          </FormGroup>
        </Stack>

        <BarChart
          height={380}
          grid={{ horizontal: true }}
          xAxis={[{ data: labels, scaleType: 'band', tickLabelStyle: { ...axisFontStyle, fontSize: 12 } }]}
          yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }]}
          series={data
            .filter(
              (series) =>
                (series.label === 'Người dùng đang hoạt động' && showActiveUsers) ||
                (series.label === 'Tổng người dùng' && showTotalUsers) ||
                (series.label === 'Nam' && showMale) ||
                (series.label === 'Nữ' && showFemale)
            )
            .map((series) => ({ ...series, type: 'bar' }))}
          slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
          axisHighlight={{ x: 'none' }}
          margin={{ top: 30, left: 40, right: 10 }}
          tooltip={{ trigger: 'item' }}
          sx={{
            '& .MuiBarElement-root:hover': { opacity: 0.6 },
            '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': {
              stroke: theme.palette.divider
            }
          }}
        />
      </Box>
    </MainCard>
  );
}
