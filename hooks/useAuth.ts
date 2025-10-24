
import { useContext } from 'react';
import { AuthContext } from '../src/contexts/AuthContext';
import type { AuthContextType } from '../src/contexts/AuthContext';


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};