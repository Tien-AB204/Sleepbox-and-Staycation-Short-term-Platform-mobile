// Mock API Service for Authentication

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
  token?: string;
}

// Mock user data
const MOCK_USER = {
  id: "1",
  username: "kien123",
  password: "123456",
  name: "Trung Kien",
  email: "helloteja@gmail.com",
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  // Mock login API
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate network delay
    await delay(1000);

    // Validate credentials
    if (
      credentials.username === MOCK_USER.username &&
      credentials.password === MOCK_USER.password
    ) {
      return {
        success: true,
        message: "Login successful",
        user: {
          id: MOCK_USER.id,
          username: MOCK_USER.username,
          name: MOCK_USER.name,
          email: MOCK_USER.email,
        },
        token: "mock_token_" + Date.now(),
      };
    } else {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }
  },

  // Mock signup API
  signup: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    await delay(1000);

    return {
      success: true,
      message: "Account created successfully",
      user: {
        id: "2",
        username: data.email.split("@")[0],
        name: "New User",
        email: data.email,
      },
      token: "mock_token_" + Date.now(),
    };
  },

  // Mock logout
  logout: async (): Promise<void> => {
    await delay(500);
  },
};
