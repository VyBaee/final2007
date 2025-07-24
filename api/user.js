import axios from 'axios';

export const filterUsers = async (filterBody) => {
  const response = await axios.post('http://localhost:8080/api/v1/user/filter', filterBody);
  return response.data;
};
