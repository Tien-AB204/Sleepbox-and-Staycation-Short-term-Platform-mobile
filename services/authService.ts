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
    role: "guest" | "host";
  };
  token?: string;
}

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    username: "kien123",
    password: "123456",
    name: "Trung Kien",
    email: "helloteja@gmail.com",
    role: "guest" as "guest" | "host",
  },
  {
    id: "2",
    username: "tien123",
    password: "123456",
    name: "Tien Host",
    email: "tienhost@boxhub.com",
    role: "host" as "guest" | "host",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  // Mock login API
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate network delay
    await delay(1000);

    // Validate credentials
    const found = MOCK_USERS.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );
    if (found) {
      return {
        success: true,
        message: "Login successful",
        user: {
          id: found.id,
          username: found.username,
          name: found.name,
          email: found.email,
          role: found.role,
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
    role: "guest" | "host";
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
        role: data.role,
      },
      token: "mock_token_" + Date.now(),
    };
  },

  // Mock logout
  logout: async (): Promise<void> => {
    await delay(500);
  },
};
