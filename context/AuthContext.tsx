import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authFetch } from "../src/api";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type UserRole = "customer" | "provider" | "admin";

export interface AuthUser {
  role: UserRole;
  name: string;
  phone: string;
  email: string;        // email is always available (local or Google)
  avatar?: string;      // Profile picture URL (Google users)
  authProvider?: string; // "local" | "google"
}

interface AuthContextType {
  /** Resolved user, or null if not logged in. */
  user: AuthUser | null;
  /** True once the initial AsyncStorage read has finished. */
  isReady: boolean;
  /** Indicates whether onboarding has been completed. */
  onboardingCompleted: boolean;
  /** Persist session and update state. Navigation handled by _layout.tsx. */
  login: (role: UserRole, name?: string, phone?: string, email?: string, avatar?: string, authProvider?: string) => Promise<void>;
  /** Clear session state. Navigation handled by the caller. */
  logout: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Storage Keys
// ─────────────────────────────────────────────

const KEYS = {
  token: "token",
  onboarding: "onboardingCompleted",
} as const;

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // ── Bootstrap: rehydrate session from AsyncStorage ──
  useEffect(() => {
    const rehydrate = async () => {
      try {
        const onboarding = await AsyncStorage.getItem(KEYS.onboarding);
        setOnboardingCompleted(!!onboarding);

        const token = await AsyncStorage.getItem(KEYS.token);
        if (token) {
          const res = await authFetch('/auth/me');
          if (res.user) {
            setUser({
              role: res.user.role as UserRole,
              name: res.user.name,
              phone: res.user.phone ?? "",
              email: res.user.email ?? "",
              avatar: res.user.avatar,
              authProvider: res.user.authProvider,
            });
          }
        }
      } catch (e) {
        console.warn("[AuthContext] Failed to rehydrate session:", e);
        // Token might be invalid, clear it
        await AsyncStorage.removeItem(KEYS.token);
      } finally {
        setIsReady(true);
      }
    };
    rehydrate();
  }, []);

  // ── Login: persist session state ──
  // Navigation is handled by the caller (AppStack or login/register screens).
  const login = async (
    role: UserRole,
    name: string = "",
    phone: string = "",
    email: string = "",
    avatar?: string,
    authProvider: string = "local"
  ) => {
    // The actual login API call will happen in the login/register screens,
    // which will set the token in AsyncStorage. This method is just to update the state.
    await AsyncStorage.setItem(KEYS.onboarding, "true");
    setOnboardingCompleted(true);
    setUser({ role, name, phone, email, avatar, authProvider });
  };

  const logout = async () => {
    await AsyncStorage.removeItem(KEYS.token);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isReady, onboardingCompleted, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
