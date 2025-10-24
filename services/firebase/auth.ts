import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Auth providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// Types
export type UserRole = 'student' | 'teacher' | 'director' | 'admin';
export type GradeLevel = 'primaria' | 'secundaria' | 'preparatoria';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId: string;
  gradeLevel?: GradeLevel;
  createdAt: any;
  lastLogin: any;
}

/**
 * Sign up with email and password
 */
export const signUp = async (
  email: string,
  password: string,
  userData: Omit<UserData, 'uid' | 'createdAt' | 'lastLogin'>
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with name
    await updateProfile(user, {
      displayName: userData.name,
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    await setDoc(
      doc(db, 'users', userCredential.user.uid),
      { lastLogin: serverTimestamp() },
      { merge: true }
    );

    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Usuario',
        role: 'student', // Default role
        schoolId: 'default', // To be updated
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      // Update last login
      await setDoc(
        doc(db, 'users', user.uid),
        { lastLogin: serverTimestamp() },
        { merge: true }
      );
    }

    return user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with Microsoft (for school accounts)
 */
export const signInWithMicrosoft = async () => {
  try {
    microsoftProvider.setCustomParameters({
      tenant: 'common', // Can be configured for specific school tenants
    });

    const result = await signInWithPopup(auth, microsoftProvider);
    const user = result.user;

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Usuario',
        role: 'student',
        schoolId: 'default',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      await setDoc(
        doc(db, 'users', user.uid),
        { lastLogin: serverTimestamp() },
        { merge: true }
      );
    }

    return user;
  } catch (error: any) {
    console.error('Error signing in with Microsoft:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates: {
  displayName?: string;
  email?: string;
  password?: string;
}) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    if (updates.displayName) {
      await updateProfile(user, { displayName: updates.displayName });
    }

    if (updates.email) {
      await updateEmail(user, updates.email);
    }

    if (updates.password) {
      await updatePassword(user, updates.password);
    }

    return user;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Get current user data from Firestore
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get user-friendly error messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este correo ya está registrado',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos, intenta más tarde',
    'auth/network-request-failed': 'Error de conexión',
    'auth/popup-closed-by-user': 'Inicio de sesión cancelado',
    'auth/requires-recent-login': 'Por seguridad, vuelve a iniciar sesión',
  };

  return errorMessages[errorCode] || 'Error al procesar la solicitud';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
