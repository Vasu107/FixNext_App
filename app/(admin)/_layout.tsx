import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  // ── RBAC Guard: admins only ──
  useEffect(() => {
    if (isReady && user?.role !== "admin") {
      router.replace("/login" as any);
    }
  }, [isReady, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
