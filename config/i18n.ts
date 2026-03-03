import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import 2 file ngôn ngữ vừa tách
import en from './locales/en';
import vi from './locales/vi';

// Tạo resource object
const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Ngôn ngữ mặc định
    fallbackLng: 'en', // Nếu không tìm thấy ngôn ngữ thì dùng tiếng Anh
    interpolation: {
      escapeValue: false,
    },
  });

export const loadLanguage = async () => {
  try {
    const savedLng = await AsyncStorage.getItem('language');
    if (savedLng) {
      await i18n.changeLanguage(savedLng);
    }
  } catch (error) {
    console.log("Error loading language", error);
  }
};

export default i18n;