// Đường dẫn: services/authService.ts
import api from '../config/axios'; // Đảm bảo đường dẫn này đúng với cấu trúc của bạn
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- INTERFACES CHO API THẬT ---
interface LoginCredentials {
  email: string;
  password: string;
}

// Theo Swagger của bạn, đăng ký guest cần 3 trường này
interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string; 
}

// --- KIỂU DỮ LIỆU & MOCK DATA CHO PROFILE (GIỮ NGUYÊN) ---
export type Role = "guest" | "host";

export interface User {
  user_id: string;
  username: string;
  email: string;
  phone: string;
  password_hash: string;
  role: Role;
  user_status: string;
  is_email_verified: boolean;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
}

export interface UserProfile {
  profile_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  avatar_url: string;
  updated_at: string;
}

// Mock Data cho Profile
const MOCK_USERS: User[] = [
  {
    user_id: "u-1",
    username: "trungkien_99",
    email: "guest@gmail.com",
    phone: "0912 345 678",
    password_hash: "123456",
    role: "guest",
    user_status: "ACTIVE",
    is_email_verified: true,
    email_verified_at: "2025-01-01T10:00:00Z",
    last_login_at: "2026-02-26T08:00:00Z",
    created_at: "2025-01-01T09:00:00Z",
  }
];

const MOCK_PROFILES: UserProfile[] = [
  {
    profile_id: "p-1",
    user_id: "u-1",
    first_name: "Trung",
    last_name: "Kien",
    gender: "Male",
    date_of_birth: "15/08/1999",
    avatar_url: "https://i.pravatar.cc/300?img=47",
    updated_at: "2026-02-20T10:00:00Z",
  }
];

export const authService = {

  // 1. GỌI API LOGIN
  login: async (credentials: LoginCredentials) => {
    try {
      // Gọi đúng endpoint (không có /api ở đầu vì baseURL đã có)
      const response = await api.post('/auth/guest/login', credentials);
      console.log("Response từ server:", response.data);
      // Lấy token đúng theo cấu trúc Swagger trả về
      const token = response.data.accessToken;

      if (token) {
        await AsyncStorage.setItem('token', token);
        return {
          success: true,
          message: "Login successful",
          // Tạm thời gán role là guest để App cho phép qua màn hình Home
          user: { role: "guest", email: credentials.email } 
        };
      } else {
        return { success: false, message: "Không nhận được token từ server." };
      }

    } catch (error: any) {
      // In lỗi ra terminal để dễ sửa nếu còn sai
      console.log('--- CHI TIẾT LỖI LOGIN ---');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      } else {
        console.log('Lỗi mạng/Khác:', error.message);
      }

      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401 || error.response?.status === 400 || error.response?.status === 404) {
        errorMessage = 'Sai email hoặc mật khẩu.';
      }
      
      return { success: false, message: errorMessage };
    }
  },

  // 2. GỌI API ĐĂNG KÝ (SIGNUP)
  signup: async (data: any) => {
    try {
      const response = await api.post('/auth/guest/register', {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      
      return {
        success: true,
        message: "Account created successfully!",
      };
    } catch (error: any) {
      console.log('Signup error:', error.response?.data || error.message);
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      return { success: false, message: errorMessage };
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('token');
  },


  // --- MOCK DATA DÀNH CHO PROFILE (GIỮ NGUYÊN) ---

  getProfile: async () => {
    // Delay 500ms để giả lập loading API
    await new Promise((resolve) => setTimeout(resolve, 500)); 
    
    // Tạm thời luôn lấy user "u-1" vì chưa có data thật
    const currentUserId = "u-1"; 
    const user = MOCK_USERS.find((u) => u.user_id === currentUserId);
    const profile = MOCK_PROFILES.find((p) => p.user_id === currentUserId);

    if (user && profile) {
      return {
        username: user.username,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.is_email_verified,
        firstName: profile.first_name,
        lastName: profile.last_name,
        gender: profile.gender,
        dob: profile.date_of_birth,
        avatar: profile.avatar_url,
      };
    }
    return null;
  },

  updateProfile: async (updatedData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, message: "Profile updated" };
  }
};