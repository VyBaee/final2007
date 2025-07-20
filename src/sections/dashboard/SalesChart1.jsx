import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Charts
import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from 'components/MainCard';
import { useGetMenuMaster } from '../../api/menu'; // Đường dẫn đúng

// ==============================|| USER STATISTIC COLUMN CHART ||============================== //

export default function UserStatisticChart() {
  const theme = useTheme();
  
  // State to store the data and loading status
  const [userStatistic, setUserStatistic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUnder18, setShowUnder18] = useState(true);
  const [showage18_24, setShowage18_24] = useState(true);
  const [showage25_34, setShowage25_34] = useState(true);
  const [showage35_44, setShowage35_44] = useState(true);
  const [showover45, setShowover45] = useState(true);

  // Fetch user statistic data from API
  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await fetch('http://192.168.86.120:8083/api/v1/users/statistics/age-groups'); // Thay đổi đường dẫn API nếu cần
        if (!response.ok) {
          throw new Error('Failed to fetch user statistics');
        }
        const data = await response.json();
        setUserStatistic(data); // Set the API data to the state
      } catch (err) {
        setError(err.message); // Handle error if API call fails
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchUserStatistics(); // Fetch data when the component mounts
  }, []);

  // Handle loading and error
  if (loading) {
    return <Typography>Loading...</Typography>; // Show loading text if still fetching data
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>; // Show error message if API call fails
  }

  // Extract data from the fetched user statistics
  const labels = userStatistic.map((item) => item.name);
  const under18 = userStatistic.map((item) => item.under18);
  const age18_24 = userStatistic.map((item) => item.age18_24);
  const age25_34 = userStatistic.map((item) => item.age25_34);
  const age35_44 = userStatistic.map((item) => item.age35_44);
  const over45 = userStatistic.map((item) => item.over45);

  // Define the colors and value formatter
  const valueFormatter = (value) => `${value} người dùng`;
  const primaryColor = theme.palette.primary.main;        // Tổng người dùng
  const under18Color = theme.palette.error.light;         // Dưới 18 tuổi – đỏ nhạt
  const age18_24Color = theme.palette.warning.main;       // Cam – tuổi trẻ
  const age25_34Color = theme.palette.info.main;          // Xanh dương – độ tuổi chính
  const age35_44Color = theme.palette.secondary.main;     // Tím – trưởng thành
  const over45Color = theme.palette.grey[700];            // Xám đậm – lớn tuổi

  const data = [
    { data: under18, label: 'Dưới 18 tuổi', color: under18Color, valueFormatter },
    { data: age18_24, label: 'Từ 18 - 24 tuổi', color: age18_24Color, valueFormatter },
    { data: age25_34, label: 'Từ 25 - 34 tuổi', color: age25_34Color, valueFormatter },
    { data: age35_44, label: 'Từ 35 - 44 tuổi', color: age35_44Color, valueFormatter },
    { data: over45, label: 'Trên 45 tuổi', color: over45Color, valueFormatter }
  ];

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              User Statistics
            </Typography> */}
            {/* <Typography variant="h4">
              {userStatistic.reduce((acc, cur) => acc + cur.totalUsers, 0)} người dùng
            </Typography> */}
          </Box>

          <FormGroup>
            <Stack direction="row">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showUnder18}
                    onChange={() => setShowUnder18(!showUnder18)}
                    sx={{
                      '&.Mui-checked': { color: under18Color }
                    }}
                  />
                }
                label="Dưới 18 tuổi"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showage18_24}
                    onChange={() => setShowage18_24(!showage18_24)}
                    sx={{
                      '&.Mui-checked': { color: age18_24Color }
                    }}
                  />
                }
                label="Từ 18 - 24 tuổi"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showage25_34}
                    onChange={() => setShowage25_34(!showage25_34)}
                    sx={{
                      '&.Mui-checked': { color: age25_34Color }
                    }}
                  />
                }
                label="Từ 25 - 34 tuổi"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showage35_44}
                    onChange={() => setShowage35_44(!showage35_44)}
                    sx={{
                      '&.Mui-checked': { color: age35_44Color }
                    }}
                  />
                }
                label="Từ 35 - 44 tuổi"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showover45}
                    onChange={() => setShowover45(!showover45)}
                    sx={{
                      '&.Mui-checked': { color: over45Color }
                    }}
                  />
                }
                label="Trên 45 tuổi"
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
                (series.label === 'Dưới 18 tuổi' && showUnder18) ||
                (series.label === 'Từ 18 - 24 tuổi' && showage18_24) ||
                (series.label === 'Từ 25 - 34 tuổi' && showage25_34) ||
                (series.label === 'Từ 35 - 44 tuổi' && showage35_44) ||
                (series.label === 'Trên 45 tuổi' && showover45)
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
