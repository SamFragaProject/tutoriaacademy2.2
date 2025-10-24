import type { User } from '../types';
import { MOCK_USER_STUDENT, MOCK_USER_ADMIN } from '../constants';

const USERS_KEY = 'admin:users';

// FIX: Replaced deprecated 'isAdmin' property with the correct 'role' property to align with the User type.
const MOCK_USERS_INITIAL: User[] = [
  MOCK_USER_STUDENT,
  MOCK_USER_ADMIN,
  // FIX: Added missing 'schoolId' and 'schoolName' properties to mock user objects to satisfy the User type.
  // FIX: Added missing 'masteryScore' property to satisfy the User type.
  {
    id: 'user-002', name: 'Carlos Gomez', email: 'carlos.g@example.com', role: 'alumno', schoolId: 'school-01', schoolName: 'Colegio Vanguardia', xp: 8500, accuracy: 78, streak: 5, activeSubjects: 3, examDate: '2024-11-20', tokenSavingMode: true, career: 'unam_area1', masteryScore: 780
  },
  // FIX: Added missing 'masteryScore' property to satisfy the User type.
  {
    id: 'user-003', name: 'Ana Sofia R.', email: 'ana.sofia@example.com', role: 'alumno', schoolId: 'school-01', schoolName: 'Colegio Vanguardia', xp: 14200, accuracy: 92, streak: 25, activeSubjects: 4, examDate: '2024-12-01', tokenSavingMode: false, career: 'unam_area2', masteryScore: 920
  },
  // FIX: Added missing 'masteryScore' property to satisfy the User type.
  {
    id: 'user-004', name: 'Luis Garcia', email: 'luis.g@example.com', role: 'alumno', schoolId: 'school-01', schoolName: 'Colegio Vanguardia', xp: 3200, accuracy: 65, streak: 2, activeSubjects: 2, examDate: '2025-01-10', tokenSavingMode: false, career: 'ipn_area2', masteryScore: 650
  },
];

const getUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') return MOCK_USERS_INITIAL;
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS_INITIAL));
    return MOCK_USERS_INITIAL;
  } catch {
    return MOCK_USERS_INITIAL;
  }
};

const setUsersToStorage = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to storage:', err);
  }
};

export const getUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(res => setTimeout(res, 300));
  return getUsersFromStorage();
};

export const getUserById = async (userId: string): Promise<User | null> => {
  await new Promise(res => setTimeout(res, 100));
  const users = getUsersFromStorage();
  return users.find(u => u.id === userId) || null;
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  await new Promise(res => setTimeout(res, 300));
  
  const users = getUsersFromStorage();
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
  };
  
  users.push(newUser);
  setUsersToStorage(users);
  
  return newUser;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  await new Promise(res => setTimeout(res, 300));
  
  const users = getUsersFromStorage();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    throw new Error('Usuario no encontrado');
  }
  
  users[index] = { ...users[index], ...updates };
  setUsersToStorage(users);
  
  return users[index];
};

export const deleteUser = async (userId: string): Promise<void> => {
  await new Promise(res => setTimeout(res, 300));
  
  const users = getUsersFromStorage();
  const filtered = users.filter(u => u.id !== userId);
  
  if (filtered.length === users.length) {
    throw new Error('Usuario no encontrado');
  }
  
  setUsersToStorage(filtered);
};

export const toggleUserActive = async (userId: string, active: boolean): Promise<User> => {
  await new Promise(res => setTimeout(res, 300));
  
  const users = getUsersFromStorage();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    throw new Error('Usuario no encontrado');
  }
  
  (users[index] as any).active = active;
  setUsersToStorage(users);
  
  return users[index];
};

export const resetUserPassword = async (userId: string): Promise<string> => {
  await new Promise(res => setTimeout(res, 300));
  
  const users = getUsersFromStorage();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Generate random password
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const newPassword = Array.from({ length: 10 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  
  // In real app, would hash and save to backend
  console.log(`Password reset for ${user.email}: ${newPassword}`);
  
  return newPassword;
};

export const bulkCreateUsers = async (
  usersData: Array<Omit<User, 'id'>>
): Promise<{ success: User[], failed: Array<{ data: any, error: string }> }> => {
  await new Promise(res => setTimeout(res, 500));
  
  const users = getUsersFromStorage();
  const success: User[] = [];
  const failed: Array<{ data: any, error: string }> = [];
  
  for (const userData of usersData) {
    try {
      // Validate email uniqueness
      if (users.some(u => u.email === userData.email)) {
        failed.push({ data: userData, error: 'Email ya existe' });
        continue;
      }
      
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      users.push(newUser);
      success.push(newUser);
      
    } catch (err) {
      failed.push({ data: userData, error: (err as Error).message });
    }
  }
  
  setUsersToStorage(users);
  
  return { success, failed };
};