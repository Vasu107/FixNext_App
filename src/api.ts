import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use environment variable if available, fallback for local dev
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api');

export const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = await AsyncStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
    
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.error || 'API Error');
    }
    
    return data;
};
