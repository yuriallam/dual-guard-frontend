// User data storage utilities
// Stores user data in localStorage for better UX (instant display on page load)
// Always fetches fresh data from API in the background

import type { User } from '@/types/entities/user';

const USER_STORAGE_KEY = 'dualguard_user';

/**
 * Save user data to localStorage
 */
export const saveUserToStorage = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    // Handle localStorage errors (e.g., quota exceeded, private browsing)
    console.warn('Failed to save user to localStorage:', error);
  }
};

/**
 * Load user data from localStorage
 */
export const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as User;
  } catch (error) {
    // Handle parsing errors or corrupted data
    console.warn('Failed to load user from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

/**
 * Clear user data from localStorage
 */
export const clearUserFromStorage = (): void => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear user from localStorage:', error);
  }
};

