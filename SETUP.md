# 📱 BoxHub Mobile App - Hướng Dẫn Cài Đặt và Chạy Dự Án

## 📋 Mục Lục
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt](#cài-đặt)
- [Chạy Dự Án](#chạy-dự-án)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Troubleshooting](#troubleshooting)

---

## 🖥️ Yêu Cầu Hệ Thống

### Phần mềm cần thiết:
- **Node.js**: >= 18.x ([Download](https://nodejs.org/))
- **npm** hoặc **yarn**: Đi kèm với Node.js
- **Expo CLI**: Sẽ được cài tự động
- **Git**: Để clone repository

### Thiết bị để test:
- **Expo Go App** (iOS/Android): [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- Hoặc **iOS Simulator** (macOS) / **Android Emulator**

---

## 📦 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/ThaiTuKien1012/FE-GUEST-MOBLIE.git
cd FE-GUEST-MOBLIE/FE-GUEST-MOBLIE
```

### 2. Cài Đặt Dependencies

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install
```

### 3. Cài Đặt Expo CLI (nếu chưa có)

```bash
npm install -g expo-cli
```

---

## 🚀 Chạy Dự Án

### Chạy Development Server

```bash
# Sử dụng npm
npm start

# Hoặc sử dụng yarn
yarn start

# Hoặc sử dụng expo
npx expo start
```

### Chạy trên các nền tảng cụ thể:

```bash
# iOS (chỉ trên macOS)
npm run ios
# hoặc
npx expo start --ios

# Android
npm run android
# hoặc
npx expo start --android

# Web
npm run web
# hoặc
npx expo start --web
```

### Scan QR Code với Expo Go

1. Chạy `npm start`
2. Mở **Expo Go** app trên điện thoại
3. Scan QR code xuất hiện trong terminal hoặc browser
4. App sẽ tự động load

---

## 📁 Cấu Trúc Dự Án

```
FE-GUEST-MOBLIE/
├── app/                          # 📱 Screens (Expo Router)
│   ├── index.tsx                 # 🔐 Login Screen
│   ├── signup.tsx                # 📝 Sign Up Screen
│   ├── home.tsx                  # 🏠 Home Screen
│   ├── detail.tsx                # 📋 Box Detail Screen
│   ├── map.tsx                   # 🗺️ Map View Screen
│   ├── filter.tsx                # 🔍 Filter Screen
│   ├── selectbox.tsx             # 🏢 Box Selection Grid
│   ├── payment.tsx               # 💰 Payment Details
│   ├── paymentmethod.tsx         # 💳 Payment Method Selection
│   ├── bookingdetail.tsx         # 🎫 Booking Confirmation
│   ├── booking.tsx               # 📅 My Booking Screen
│   ├── message.tsx               # 💬 Chat Screen
│   ├── notifications.tsx         # 🔔 Notifications
│   ├── profile.tsx               # 👤 User Profile
│   └── _layout.tsx               # 🎨 Root Layout
│
├── components/                   # 🧩 Reusable Components
│   ├── GoogleIcon.tsx            # Google Logo SVG
│   └── Icons.tsx                 # Custom Icons (Back, Search, Filter, Chat)
│
├── services/                     # 🔧 Services & APIs
│   └── authService.ts            # Mock Authentication Service
│
├── assets/                       # 🖼️ Images & Static Files
├── app.json                      # ⚙️ Expo Configuration
├── package.json                  # 📦 Dependencies
└── tsconfig.json                 # 📘 TypeScript Config
```

---

## ✨ Tính Năng

### 🔐 Authentication
- ✅ Login với mock API (`kien123` / `123456`)
- ✅ Sign Up form
- ✅ Google Sign In UI

### 🏠 Home & Discovery
- ✅ Search boxes nearby
- ✅ Popular & Recommended listings
- ✅ Rating badges
- ✅ Bottom navigation

### 🗺️ Map & Location
- ✅ Interactive map view
- ✅ Location markers với rating
- ✅ Draggable bottom sheet
- ✅ Filter tabs

### 🔍 Search & Filter
- ✅ Advanced filters (Destination, Time, Box Type)
- ✅ Price range slider
- ✅ Amenities selection
- ✅ Calendar picker modal

### 📦 Booking Flow
1. **Box Detail** → Xem thông tin chi tiết
2. **Select Box** → Chọn phòng available
3. **Payment Details** → Xác nhận booking info
4. **Payment Method** → Chọn VNPay/MoMo
5. **Booking Confirmation** → QR Code & Barcode

### 📅 My Booking
- ✅ Incoming bookings (Unconfirmed/Confirmed)
- ✅ History (Completed/Cancelled)
- ✅ Re-book functionality
- ✅ Rating system

### 💬 Communication
- ✅ Chat with support
- ✅ Real-time messaging UI
- ✅ Notifications list

### 👤 Profile
- ✅ User information
- ✅ Settings (Language, Appearance)
- ✅ Edit profile

---

## 🛠️ Công Nghệ Sử Dụng

### Core Technologies
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - File-based routing

### UI & Styling
- **React Native StyleSheet** - Component styling
- **Plus Jakarta Sans** - Custom font family
- **React Native SVG** - Custom icons

### Libraries
- `@expo-google-fonts/plus-jakarta-sans` - Font loading
- `@react-native-community/slider` - Price range slider
- `expo-router` - Navigation
- `react-native-svg` - SVG support

### Mock Services
- Custom authentication service
- Simulated API delays
- Local state management

---

## 🔑 Mock Login Credentials

```
Email: kien123
Password: 123456
```

---

## 🐛 Troubleshooting

### Lỗi: "Module not found"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Lỗi: "Expo CLI not found"
```bash
# Cài đặt Expo CLI global
npm install -g expo-cli
```

### Lỗi: "Port already in use"
```bash
# Chạy với port khác
npx expo start --port 8081
```

### Lỗi: Font không load
```bash
# Clear Expo cache
npx expo start -c
```

### Lỗi: QR Code không scan được
- Đảm bảo điện thoại và máy tính cùng mạng WiFi
- Tắt VPN nếu đang bật
- Thử dùng tunnel mode: `npx expo start --tunnel`

### Lỗi: Android emulator không kết nối
```bash
# Kiểm tra adb devices
adb devices

# Nếu không thấy device, restart adb
adb kill-server
adb start-server
```

---

## 📱 Screens Flow

```
Login (index.tsx)
  ↓
Home (home.tsx)
  ├── Detail (detail.tsx)
  │   ├── Select Box (selectbox.tsx)
  │   │   └── Payment (payment.tsx)
  │   │       └── Payment Method (paymentmethod.tsx)
  │   │           └── Booking Detail (bookingdetail.tsx)
  │   └── Message (message.tsx)
  ├── Map (map.tsx)
  │   ├── Filter (filter.tsx)
  │   └── Detail (detail.tsx)
  ├── My Booking (booking.tsx)
  │   └── Booking Detail (bookingdetail.tsx)
  ├── Message (message.tsx)
  ├── Notifications (notifications.tsx)
  └── Profile (profile.tsx)
```

---

## 🎨 Design System

### Colors
- **Primary Brown**: `#8D613A` - Buttons, CTAs
- **Blue**: `#3B82F6` - Links, Active states
- **Orange**: `#F97316` - Warnings, Ratings
- **Green**: `#10B981` - Success, Available status
- **Gray Scale**: `#1A1A1A`, `#666666`, `#999999`, `#F5F5F5`

### Typography
- **Font Family**: Plus Jakarta Sans
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Style**: Italic for most body text

### Spacing
- **Padding**: 16px, 20px, 24px
- **Margin**: 12px, 16px, 20px
- **Border Radius**: 12px, 16px, 20px, 28px

---

## 📝 Notes

### Development Tips
- Sử dụng **Expo Go** app để test nhanh trên thiết bị thật
- Bật **Fast Refresh** để thấy thay đổi ngay lập tức
- Dùng **React DevTools** để debug
- Check **Expo Console** để xem logs

### Best Practices
- Giữ components nhỏ và reusable
- Sử dụng TypeScript types đầy đủ
- Follow naming convention hiện tại
- Test trên cả iOS và Android

---

## 👨‍💻 Development Team

- **Developer**: ThaiTuKien1012
- **Repository**: [GitHub](https://github.com/ThaiTuKien1012/FE-GUEST-MOBLIE)

---

## 📄 License

This project is private and proprietary.

---

## 🤝 Support

Nếu gặp vấn đề, hãy tạo issue trên GitHub repository hoặc liên hệ development team.

---

**Happy Coding! 🚀**
