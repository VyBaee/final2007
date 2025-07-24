import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Charts
import { LineChart } from '@mui/x-charts/LineChart';

// project imports
import MainCard from 'components/MainCard';
import { SERVER_IP_USER_AGE, API_VERSION, PROTOCOL } from '../../../configs/serverConfig'

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({ view }) {
  const theme = useTheme();

  // State to store the income data and loading status
  const [incomeData, setIncomeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visibility, setVisibility] = useState({
    'Tổng người dùng': true,
    'Người dùng đang hoạt động': true,
    'Nam': true,
    'Nữ': true
  });

  // Get today's date and calculate start and end of the day
  const now = new Date();
  const start = new Date(now.setHours(0, 0, 0, 0)); // Start of today (00:00)
  const end = new Date(now.setHours(23, 59, 59, 999)); // End of today (23:59)

  // Format the start and end dates to match your API requirements
  const startDate = start.toISOString().split('T')[0]; // Format as yyyy-mm-dd
  const endDate = end.toISOString().split('T')[0]; // Format as yyyy-mm-dd

  // Fetch data from the API
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        // Gọi API với đường dẫn đầy đủ và tham số start, end
        const response = await fetch(`${PROTOCOL}${SERVER_IP_USER_AGE}${API_VERSION}/users/statistics?start=${startDate}&end=${endDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setIncomeData(data); // Dữ liệu trả về sẽ được lưu vào incomeData
      } catch (err) {
        setError(err.message); // Set error if the API call fails
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchIncomeData(); // Fetch data when component mounts
  }, [startDate, endDate]);

  // Handle loading and error
  if (loading) {
    return <Typography>Loading...</Typography>; // Show loading text if still fetching data
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>; // Show error message if API call fails
  }

  // Get the relevant data based on view (daily, weekly, monthly, quarterly, yearly)
  let labels = [];
  let data1 = [];
  let data2 = [];
  let data3 = [];
  let data4 = [];

  if (view === 'daily') {
    // 24 hours in a day
    labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    data1 = Array(24).fill(incomeData.totalUsers || 0); // Fill the data for each hour (mocked for now)
    data2 = Array(24).fill(incomeData.activeUsers || 0); // Fill the data for each hour (mocked for now)
    data3 = Array(24).fill(incomeData.maleUsers || 0); // Fill the data for each hour (mocked for now)
    data4 = Array(24).fill(incomeData.femaleUsers || 0); // Fill the data for each hour (mocked for now)
  } else if (view === 'weekly') {
    // 7 days in a week (assuming data is available for each day of the week)
    labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    // Assuming your API returns data for each day of the week
    data1 = Array(7).fill(incomeData.totalUsers || 0);
    data2 = Array(7).fill(incomeData.activeUsers || 0);
    data3 = Array(7).fill(incomeData.maleUsers || 0);
    data4 = Array(7).fill(incomeData.femaleUsers || 0);
  } else if (view === 'monthly') {
    // Number of days in the current month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    // Assuming data for each day of the current month is available
    data1 = Array(daysInMonth).fill(incomeData.totalUsers || 0);
    data2 = Array(daysInMonth).fill(incomeData.activeUsers || 0);
    data3 = Array(daysInMonth).fill(incomeData.maleUsers || 0);
    data4 = Array(daysInMonth).fill(incomeData.femaleUsers || 0);
  } else if (view === 'quarterly') {
    // 3 months in a quarter
    labels = ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'];
    data1 = Array(4).fill(incomeData.totalUsers || 0);
    data2 = Array(4).fill(incomeData.activeUsers || 0);
    data3 = Array(4).fill(incomeData.maleUsers || 0);
    data4 = Array(4).fill(incomeData.femaleUsers || 0);
  } else if (view === 'yearly') {
    // 12 months in a year
    labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    data1 = Array(12).fill(incomeData.totalUsers || 0);
    data2 = Array(12).fill(incomeData.activeUsers || 0);
    data3 = Array(12).fill(incomeData.maleUsers || 0);
    data4 = Array(12).fill(incomeData.femaleUsers || 0);
  }

  const line = theme.palette.divider;

  // Toggle visibility of series
  const toggleVisibility = (label) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: data1,
      label: 'Tổng người dùng',
      showMark: false,
      area: true,
      id: 'Germany',
      color: theme.palette.primary.main || '',
      visible: visibility['Tổng người dùng']
    },
    {
      data: data2,
      label: 'Người dùng đang hoạt động',
      showMark: false,
      area: true,
      id: 'UK',
      color: theme.palette.primary[700] || '',
      visible: visibility['Người dùng đang hoạt động']
    },
    {
      data: data3,
      label: 'Nam',
      showMark: false,
      area: true,
      id: 'France',
      color: '#1E90FF',
      visible: visibility['Nam']
    },
    {
      data: data4,
      label: 'Nữ',
      showMark: false,
      area: true,
      id: 'Spain',
      color: '#FF69B4',
      visible: visibility['Nữ']
    }
  ];

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <>
      <LineChart
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFontStyle }]}
        yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }]}
        height={450}
        margin={{ top: 40, bottom: 20, right: 20 }}
        series={visibleSeries
          .filter((series) => series.visible)
          .map((series) => ({
            type: 'line',
            data: series.data,
            label: series.label,
            showMark: series.showMark,
            area: series.area,
            id: series.id,
            color: series.color,
            stroke: series.color,
            strokeWidth: 2
          }))}
        slotProps={{ legend: { hidden: true } }}
        sx={{
          '& .MuiAreaElement-series-Germany': { fill: "url('#myGradient1')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiAreaElement-series-UK': { fill: "url('#myGradient2')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line }
        }}
      />

      {/* Legend */}
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2.5, mb: 1.5 }}>
        {visibleSeries.map((item) => (
          <Stack
            key={item.label}
            direction="row"
            sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggleVisibility(item.label)}
          >
            <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'grey.500', borderRadius: '50%' }} />
            <Typography variant="body2" color="text.primary">
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </>
  );
}

IncomeAreaChart.propTypes = { view: PropTypes.oneOf(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']) };
