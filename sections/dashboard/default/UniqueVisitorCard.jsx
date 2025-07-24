import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

// ==============================|| DEFAULT - BIỂU ĐỒ TÀI CHÍNH ||============================== //

export default function UniqueVisitorCard() {
  const [view, setView] = useState('daily'); // SET DEFAULT VIEW
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">Thống kê người dùng</Typography>
        </Grid>
        <Grid>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
             <Button
              size="small"
              onClick={() => setView('daily')}
              color={view === 'daily' ? 'primary' : 'secondary'}
              variant={view === 'daily' ? 'outlined' : 'text'}
            >
              Ngày
            </Button>
            <Button
              size="small"
              onClick={() => setView('weekly')}
              color={view === 'weekly' ? 'primary' : 'secondary'}
              variant={view === 'weekly' ? 'outlined' : 'text'}
            >
              Tuần
            </Button>
            <Button
              size="small"
              onClick={() => setView('monthly')}
              color={view === 'monthly' ? 'primary' : 'secondary'}
              variant={view === 'monthly' ? 'outlined' : 'text'}
            >
              Tháng
            </Button>
            <Button
              size="small"
              onClick={() => setView('quarterly')}
              color={view === 'quarterly' ? 'primary' : 'secondary'}
              variant={view === 'quarterly' ? 'outlined' : 'text'}
            >
              Quý
            </Button>
            <Button
              size="small"
              onClick={() => setView('yearly')}
              color={view === 'yearly' ? 'primary' : 'secondary'}
              variant={view === 'yearly' ? 'outlined' : 'text'}
            >
              Năm
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view={view} />
        </Box>
      </MainCard>
    </>
  );
}
