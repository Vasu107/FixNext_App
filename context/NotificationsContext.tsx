import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { authFetch } from "../src/api";


export interface AppNotification {
    id: number;
    userId: string;
    type: string;
    title: string;
    message: string;
    time: string;
    button: string | null;
    icon: string;
    isRead: number;
    createdAt: string;
}

interface NotificationsContextType {
    notifications: AppNotification[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// No base URL here, use authFetch instead

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const { user, isReady } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    
    const unreadCount = notifications.filter(n => n.isRead === 0).length;

    const fetchNotifications = async () => {
        if (!user || !user.phone) return;
        try {
            // We use user.phone as a pseudo userId for now
            const data = await authFetch(`/notifications?userId=${user.phone}`);
            setNotifications(data.notifications || []);
        } catch (error) {
            console.log("[NotificationsContext] Error fetching notifications:", error);
        }
    };

    const markAsRead = async () => {
        if (!user || !user.phone || unreadCount === 0) return;
        try {
            const data = await authFetch(`/notifications/read`, {
                method: 'POST',
                body: JSON.stringify({ userId: user.phone })
            });
            // Optimistically update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: 1 })));
        } catch (error) {
            console.log("[NotificationsContext] Error marking notifications as read:", error);
        }
    };

    // Polling mechanism
    useEffect(() => {
        if (isReady && user) {
            fetchNotifications(); // Initial fetch
            
            // Poll every 15 seconds
            const interval = setInterval(() => {
                fetchNotifications();
            }, 15000);

            return () => clearInterval(interval);
        }
    }, [isReady, user]);

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationsContext);
    if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
    return ctx;
}
