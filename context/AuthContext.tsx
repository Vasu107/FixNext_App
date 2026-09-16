import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type UserRole = "customer" | "provider" | "admin";

export interface AuthUser {
  role: UserRole;
  name: string;
  phone: string;
}

interface AuthContextType {
  /** Resolved user, or null if not logged in. */
  user: AuthUser | null;
  /** True once the initial AsyncStorage read has finished. */
  isReady: boolean;
  /** Indicates whether onboarding has been completed. */
  onboardingCompleted: boolean;
  /** Persist session and update state. Navigation handled by _layout.tsx. */
  login: (role: UserRole, name?: string, phone?: string) => Promise<void>;
  /** Clear session state. Navigation handled by the caller. */
  logout: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Storage Keys
// ─────────────────────────────────────────────

const KEYS = {
  isLoggedIn: "isLoggedIn",
  userRole: "userRole",
  userName: "userProfile_fullName",
  userPhone: "userProfile_phone",
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
        const [loggedIn, role, name, phone, onboarding] = await Promise.all([
          AsyncStorage.getItem(KEYS.isLoggedIn),
          AsyncStorage.getItem(KEYS.userRole),
          AsyncStorage.getItem(KEYS.userName),
          AsyncStorage.getItem(KEYS.userPhone),
          AsyncStorage.getItem(KEYS.onboarding),
        ]);

        setOnboardingCompleted(!!onboarding);

        if (loggedIn === "true" && role) {
          setUser({
            role: role as UserRole,
            name: name ?? "",
            phone: phone ?? "",
          });
        }
      } catch (e) {
        console.warn("[AuthContext] Failed to rehydrate session:", e);
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
    phone: string = ""
  ) => {
    await AsyncStorage.multiSet([
      [KEYS.isLoggedIn, "true"],
      [KEYS.userRole, role],
      [KEYS.userName, name],
      [KEYS.userPhone, phone],
      [KEYS.onboarding, "true"],
    ]);
    setOnboardingCompleted(true);
    setUser({ role, name, phone });
  };

  // ── Logout: clear session state ──
  // Navigation is handled by the caller.
  const logout = async () => {
    await AsyncStorage.multiRemove([
      KEYS.isLoggedIn,
      KEYS.userRole,
      KEYS.userName,
      KEYS.userPhone,
    ]);
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
