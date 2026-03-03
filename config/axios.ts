import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://boxhub-sleepbox-platform-backend.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// Request interceptor: Tự động nhét Token vào Header trước khi gửi API đi
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Lỗi khi lấy token từ AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Xử lý lỗi trả về từ Server
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Bị lỗi 401 (Unauthorized) -> Token sai hoặc hết hạn -> Xóa token
      await AsyncStorage.removeItem('token');
      // Ở đây thường sẽ dispatch một event để đẩy user về trang Login
    }
    return Promise.reject(error);
  }
);

export default api;