import { StateCreator } from 'zustand';

import { getApi, postApi, putApi } from '@/lib/apiHelpers';

export interface Slot {
  time: string;
  isBooked: boolean;
  _id: string;
}

export interface Availability {
  day: string;
  slots: Slot[];
  _id: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  availability: Availability[];
}

export interface Patient {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  CIN: string;
  medicalHistory?: string;
}

export interface Department {
  _id: string;
  name: string;
  description: string;
}

export interface Appointment {
  _id: string;
  patient: Patient;
  doctor: Doctor;
  appointmentDate: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Confirmed';
  reason: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentSlice {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  getStatusColor: (status: string) => string;
  getStatusClass: (status: string) => string;
  fetchAppointments: () => Promise<void>;
  createAppointment: (data: Omit<Appointment, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
}

export const createAppointmentSlice: StateCreator<AppointmentSlice> = (set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,

  getStatusColor: (status: string) => {
    switch (status) {
      case 'Completed':
        return '#10B981';
      case 'Cancelled':
        return '#EF4444';
      case 'Upcoming':
        return '#3B82F6';
      case 'Confirmed':
        return '#059669';
      default:
        return '#F59E0B';
    }
  },

  getStatusClass: (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'Upcoming':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'Confirmed':
        return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    }
  },

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await getApi('/appointments');
      set({ appointments });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createAppointment: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await postApi('/appointments', data);
      await get().fetchAppointments();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAppointmentStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      await putApi(`/appointments/${id}/status`, { status });
      await get().fetchAppointments();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
});
