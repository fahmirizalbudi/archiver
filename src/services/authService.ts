import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
} from 'firebase/auth';
import type { User } from 'firebase/auth';

/**
 * Service for managing user authentication sessions.
 */
export const authService = {
  /**
   * Authenticates a user with email and password.
   * @param email - User email address.
   * @param password - User password.
   * @returns A promise resolving to the authenticated Firebase User.
   * @throws Firebase authentication error if credentials are invalid.
   */
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Terminates the current user session.
   * @returns A promise resolving when sign-out is complete.
   */
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Subscribes to authentication state changes.
   * @param callback - Function invoked when auth state changes.
   * @returns An unsubscribe function.
   */
  onAuthChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Retrieves the currently authenticated user.
   * @returns The current Firebase User or null if not authenticated.
   */
  getCurrentUser: () => {
    return auth.currentUser;
  }
};
