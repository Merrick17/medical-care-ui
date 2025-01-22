import { StateCreator } from 'zustand';
import { User, MedicalRecord } from '../types';
import { getApi, postApi, putApi, deleteApi } from '@/lib/apiHelpers';

export interface PatientSlice {
  patientProfile: User | null;
  patientAppointments: any[];
  patientMedicalHistory: MedicalRecord[];
  patients: User[];  // For admin
  isLoading: boolean;
  error: string | null;

  // Admin operations
  fetchPatients: () => Promise<void>;
  deletePatient: (id: string) => Promise<void>;

  // Fetch operations
  fetchPatientProfile: () => Promise<void>;
  fetchPatientAppointments: () => Promise<void>;
  fetchPatientMedicalHistory: () => Promise<void>;

  // Mutation operations
  updatePatientProfile: (data: FormData) => Promise<void>;
  updatePatientProfilePicture: (file: File) => Promise<void>;
  bookAppointment: (appointmentData: any) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  updateMedicalHistory: (data: Partial<MedicalRecord>) => Promise<void>;

  // Medical History CRUD operations
  createMedicalRecord: (data: FormData) => Promise<void>;
  updateMedicalRecord: (id: string, data: FormData) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;
  fetchMedicalRecordById: (id: string) => Promise<void>;
}

export const createPatientSlice: StateCreator<PatientSlice> = (set, get) => ({
  patientProfile: null,
  patientAppointments: [],
  patientMedicalHistory: [],
  patients: [],  // For admin
  isLoading: false,
  error: null,

  // Admin functions
  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getApi('/patients');
      set({ patients: response });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch patients' });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePatient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteApi(`/patients/${id}`);
      const patients = get().patients.filter(patient => patient._id !== id);
      set({ patients });
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete patient' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPatientProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getApi('/patients/profile');
      set({ patientProfile: response });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPatientAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getApi('/patients/my-appointments');
      set({ patientAppointments: response });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPatientMedicalHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getApi('/patients/my-medical-history');
      set({ patientMedicalHistory: response });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePatientProfile: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await putApi('/patients/profile', data);
      set({ patientProfile: response });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePatientProfilePicture: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      await putApi('/patients/profile-picture', formData);

      // Refetch the patient profile to get updated data
      await get().fetchPatientProfile();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update profile picture' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  bookAppointment: async (appointmentData: any) => {
    set({ isLoading: true, error: null });
    try {
      await postApi('/patients/book-appointment', appointmentData);
      // Refetch appointments after booking
      await get().fetchPatientAppointments();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelAppointment: async (appointmentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await putApi(`/appointments/${appointmentId}/status`, { status: 'Cancelled' });
      set(state => ({
        patientAppointments: state.patientAppointments.map(apt =>
          apt._id === appointmentId ? { ...apt, status: 'Cancelled' } : apt
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateMedicalHistory: async (data: Partial<MedicalRecord>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await putApi('/patients/medical-history', data);
      set(state => ({
        patientMedicalHistory: [...state.patientMedicalHistory, response]
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createMedicalRecord: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await postApi('/medical-history', data);
      // Refetch data instead of updating local state
      await get().fetchPatientMedicalHistory();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateMedicalRecord: async (id: string, data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await putApi(`/medical-history/${id}`, data);
      // Refetch data instead of updating local state
      await get().fetchPatientMedicalHistory();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMedicalRecord: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteApi(`/medical-history/${id}`);
      // Refetch data instead of updating local state
      await get().fetchPatientMedicalHistory();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMedicalRecordById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await getApi(`/medical-history/${id}`);
      // Refetch all data instead of updating single record
      await get().fetchPatientMedicalHistory();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
});
