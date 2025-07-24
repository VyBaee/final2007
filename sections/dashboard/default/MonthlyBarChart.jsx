import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';  // Thêm import Typography ở đây
import { API_VERSION, SERVER_IP_USER_AGE } from '../../../configs/serverConfig';
// import { useGetMenuMaster } from '../../../api/menu'; // Adjust the path as necessary

export default function AgeGroupBarChart() {
  const theme = useTheme();

  // State to store the data and loading status
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchAgeData = async () => {
      try {
        const response = await fetch(`http://${SERVER_IP_USER_AGE}${API_VERSION}/users/statistics/age-groups`); // Update API URL if needed
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setAgeData(data); // Save the API data to the state
      } catch (err) {
        setError(err.message); // Handle error if API call fails
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchAgeData(); // Fetch data when the component mounts
  }, []);

  // Handle loading and error
  if (loading) {
    return <Typography>Loading...</Typography>; // Show loading text if still fetching data
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>; // Show error message if API call fails
  }

  // Get data for age groups from API response
  const ageGroups = ['<18', '18-24', '25-34', '35-44', '>=45'];
  const ageGroupData = [
    ageData.ageUnder18 || 0,
    ageData.age18To24 || 0,
    ageData.age25To34 || 0,
    ageData.age35To44 || 0,
    ageData.ageOver45 || 0
  ];

  const labels = ageGroups; // Labels are the age groups

  const axisFontstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      height={380}
      series={[{ data: ageGroupData, label: 'Số người dùng theo độ tuổi', color: theme.palette.primary.main }]}
      xAxis={[
        {
          data: labels,
          scaleType: 'band',
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: axisFontstyle
        }
      ]}
      leftAxis={null}
      slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.primary.main]}
      sx={{
        '& .MuiBarElement-root:hover': { opacity: 0.6 },
        '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: theme.palette.divider }
      }}
    />
  );
}
