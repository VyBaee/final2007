import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Divider, TextField,
  Button, Stack, MenuItem, Avatar, Checkbox, FormControlLabel
} from '@mui/material';
import { filterUsers } from '../../api/user';

export default function AccountDetail() {
  const { email } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await filterUsers({ email });
        const user = res.data?.[0];
        if (user) {
          const address = user.addresses?.[0] || {};
          const fullForm = {
            ...user,
            street: address.street || '',
            ward: address.ward || '',
            district: address.district || '',
            city: address.city || '',
            country: address.country || 'Vietnam',
            is_default: address.default || false
          };
          setFormData(fullForm);
        }
      } catch (error) {
        console.error('Lỗi khi fetch user:', error);
      }
    };
    fetchUser();
  }, [email]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Dữ liệu lưu:', formData);
    alert('Lưu thành công! (mock)');
    // TODO: Gọi API PUT /user/update nếu có
  };

  const handleDelete = () => {
    console.log("Xoá tài khoản:", formData.email);
    alert('Đã xoá tài khoản! (mock)');
    // TODO: Gọi API DELETE nếu có
  };

  const roles = ['Admin', 'Moderator', 'Viewer'];
  const statuses = ['active', 'pending', 'disabled'];
  const genders = ['Nam', 'Nữ', 'Khác'];

  if (!formData) {
    return <Typography variant="h5" align="center">Đang tải dữ liệu...</Typography>;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #ece9e6, #ffffff)'
    }}>
      <Card sx={{ width: '95%', maxWidth: 900, p: 4, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Chỉnh sửa thông tin người dùng</Typography>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 80, height: 80 }} />
              <Button variant="outlined">Tải ảnh lên</Button>
            </Stack>

            <TextField label="Họ tên" value={formData.fullName || ''} onChange={(e) => handleChange('fullName', e.target.value)} fullWidth required />
            <TextField label="Email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} type="email" fullWidth required />
            <TextField select label="Vai trò" value={formData.role || ''} onChange={(e) => handleChange('role', e.target.value)} fullWidth required>
              {roles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
            </TextField>
            <TextField select label="Trạng thái" value={formData.status || ''} onChange={(e) => handleChange('status', e.target.value)} fullWidth required>
              {statuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
            <TextField label="Số điện thoại" value={formData.phoneNumber || ''} onChange={(e) => handleChange('phoneNumber', e.target.value)} fullWidth required />
            <TextField label="Ngày sinh" type="date" value={formData.birthday?.slice(0, 10) || ''} onChange={(e) => handleChange('birthday', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} required />
            <TextField select label="Giới tính" value={formData.gender || ''} onChange={(e) => handleChange('gender', e.target.value)} fullWidth required>
              {genders.map(gender => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)}
            </TextField>

            {/* Địa chỉ */}
            <Divider>Địa chỉ</Divider>
            <TextField label="Số nhà / Đường" value={formData.street || ''} onChange={(e) => handleChange('street', e.target.value)} fullWidth />
            <TextField label="Phường / Xã" value={formData.ward || ''} onChange={(e) => handleChange('ward', e.target.value)} fullWidth />
            <TextField label="Quận / Huyện" value={formData.district || ''} onChange={(e) => handleChange('district', e.target.value)} fullWidth />
            <TextField label="Tỉnh / Thành phố" value={formData.city || ''} onChange={(e) => handleChange('city', e.target.value)} fullWidth />
            <TextField label="Quốc gia" value={formData.country || ''} onChange={(e) => handleChange('country', e.target.value)} fullWidth />
            <FormControlLabel
              control={<Checkbox checked={formData.is_default || false} onChange={(e) => handleChange('is_default', e.target.checked)} />}
              label="Là địa chỉ mặc định"
            />

            {/* Thông tin hệ thống */}
            <Divider>Hệ thống</Divider>
            <TextField label="Ngày tạo" value={formData.createdAt?.slice(0, 19).replace('T', ' ')} InputProps={{ readOnly: true }} fullWidth />
            <TextField label="Ngày cập nhật" value={formData.updatedAt?.slice(0, 19).replace('T', ' ')} InputProps={{ readOnly: true }} fullWidth />
            <TextField label="Hoạt động lần cuối" value={formData.lastActive?.slice(0, 19).replace('T', ' ')} InputProps={{ readOnly: true }} fullWidth />

            {/* Hành động */}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" onClick={handleSave} fullWidth>Lưu thay đổi</Button>
              <Button variant="outlined" color="error" onClick={handleDelete} fullWidth>Xoá tài khoản</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
