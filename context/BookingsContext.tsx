import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authFetch } from "../src/api";

export type BookingStatus = "Upcoming" | "Completed" | "Cancelled";
export type JobStatus = "New" | "Accepted" | "En Route" | "Arrived" | "In Progress" | "Completed" | "Rejected";

export type BookedService = {
  id: string;
  service: string;
  price: number;
  qty: number;
  icon: string;
};

export type Booking = {
  bookingId: string;
  services: BookedService[];
  dateTime: string;
  address: string;
  total: number;
  status: BookingStatus;
  jobStatus: JobStatus;    // Provider-facing status
  placedAt: string;        // ISO string
  customerName: string;    // Added for provider view
  // Tracking fields
  otp?: string;            // 4-digit OTP generated when provider arrives
  otpVerified?: boolean;   // true after OTP confirmed by provider
  trackingActive?: boolean;// true when provider is en route
};

type BookingsContextType = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "jobStatus" | "customerName">) => void;
  updateStatus: (bookingId: string, status: BookingStatus) => void;
  updateJobStatus: (bookingId: string, jobStatus: JobStatus) => void;
  setProviderArrived: (bookingId: string) => void;
  setProviderEnRoute: (bookingId: string) => void;
  verifyOtp: (bookingId: string, enteredOtp: string) => boolean;
  newJobsCount: number;
};

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

// Random customer names for demo
const CUSTOMER_NAMES = [
  "Rahul Sharma", "Priya Singh", "Amit Verma", "Neha Gupta",
  "Vikram Patel", "Sunita Yadav", "Rohit Kumar", "Anjali Mehta",
];
const randomName = () => CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];

// Generate a random 4-digit OTP
const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000));

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await authFetch('/bookings');
      // Format backend data to match frontend types if needed
      setBookings(data.bookings || []);
    } catch (error) {
      console.log("[BookingsContext] Error fetching bookings:", error);
    }
  };

  const addBooking = async (booking: Omit<Booking, "jobStatus" | "customerName">) => {
    try {
      const data = await authFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify(booking)
      });
      if (data.booking) {
         setBookings((prev) => [data.booking, ...prev]);
      }
    } catch (error) {
       console.log("[BookingsContext] Error creating booking:", error);
       // Fallback for demo
       setBookings((prev) => [
         { ...booking, jobStatus: "New", customerName: randomName() },
         ...prev,
       ]);
    }
  };

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      await authFetch(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b))
      );
    } catch (error) {
       console.log("[BookingsContext] Error updating status:", error);
       setBookings((prev) =>
         prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b))
       );
    }
  };

  const updateJobStatus = (bookingId: string, jobStatus: JobStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId !== bookingId) return b;
        // Sync customer status when provider completes/rejects
        let status = b.status;
        if (jobStatus === "Completed") status = "Completed";
        if (jobStatus === "Rejected") status = "Cancelled";
        return { ...b, jobStatus, status };
      })
    );
  };

  // Provider taps "Navigate to Site" — marks En Route + enables tracking
  const setProviderEnRoute = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? { ...b, jobStatus: "En Route", trackingActive: true }
          : b
      )
    );
  };

  // Provider taps "I've Arrived" — generates OTP, sets status to Arrived
  const setProviderArrived = (bookingId: string) => {
    const otp = generateOtp();
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? { ...b, jobStatus: "Arrived", otp, otpVerified: false }
          : b
      )
    );
  };

  // Provider enters customer OTP — returns true if correct
  const verifyOtp = (bookingId: string, enteredOtp: string): boolean => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking || booking.otp !== enteredOtp) return false;
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? { ...b, jobStatus: "In Progress", otpVerified: true, trackingActive: false }
          : b
      )
    );
    return true;
  };

  const newJobsCount = bookings.filter((b) => b.jobStatus === "New").length;

  return (
    <BookingsContext.Provider
      value={{ bookings, addBooking, updateStatus, updateJobStatus, setProviderEnRoute, setProviderArrived, verifyOtp, newJobsCount }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within a BookingsProvider");
  return ctx;
}
