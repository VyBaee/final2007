import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import incomeData from 'mock/incomeData.json';
import analyticEcommerce from 'mock/analyticEcommerce.json';
import userStatistic from 'mock/userStatistic.json';
import userStatistic1 from 'mock/userStatistic1.json';
import calorieIntake from 'mock/calorieIntake.json';
import accountList from 'mock/accountList.json';

const initialState = {
  isDashboardDrawerOpened: false,
  incomeData,
  analyticEcommerce,
  userStatistic,
  userStatistic1,
  calorieIntake,
  accountList
};

const endpoints = {
  key: 'api/menu',
  master: 'master',
  dashboard: '/dashboard' // server URL
};

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}
