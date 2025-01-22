import { StateCreator } from 'zustand';
import { User, Appointment, DoctorStats, DoctorPatient, PatientWithHistory, DoctorPatientsHistories } from '../types';
import { getApi, postApi, putApi, deleteApi } from '@/lib/apiHelpers';
import useStore from '..';

interface DoctorAvailability {
  day: string;
  slots: Array<{
    time: string;
    isBooked: boolean;
  }>;
}

export interface DoctorSlice {
  doctors: User[];
  doctorAppointments: Appointment[];
  doctorStats: DoctorStats;
  isLoading: boolean;
  error: string | null;
  doctorPatients: DoctorPatient[];
  user: User | null;
  doctorPatientsHistories: DoctorPatientsHistories;
  // Fetch operations
  fetchDoctors: () => Promise<void>;
  fetchDoctorAppointments: () => Promise<void>;
  fetchDoctorStats: () => Promise<void>;
  fetchDoctorAvailability: (doctorId: string) => Promise<void>;
  fetchDoctorPatients: () => Promise<void>;
  fetchPatientsHistories: () => Promise<void>;
  // Mutation operations
  createDoctor: (formData: FormData) => Promise<void>;
  updateDoctorAvailability: (doctorId: string, availability: any[]) => Promise<void>;
  verifyDoctor: (doctorId: string, isValidated: boolean) => Promise<void>;
  deleteDoctor: (doctorId: string) => Promise<void>;
  updateDoctorStatus: (id: string, isValidated: boolean) => Promise<void>;
  addPatientRecord: (patientData: Omit<DoctorPatient, '_id'>) => Promise<void>;
  updatePatientRecord: (patientId: string, data: Partial<DoctorPatient>) => Promise<void>;
  updatePatientVitals: (patientId: string, vitals: DoctorPatient['vitals']) => Promise<void>;
  addPatientNote: (patientId: string, note: { type: 'diagnosis' | 'treatment'; content: string }) => Promise<void>;
  updateAppointmentStatus: (appointmentId: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => Promise<void>;
  // Profile management
  updateDoctorProfile: (data: FormData | Record<string, any>) => Promise<void>;
  updateDoctorAvailabilityProfile: (availability: DoctorAvailability[]) => Promise<void>;
}

export const createDoctorSlice: StateCreator<
  DoctorSlice,
  [],
  [],
  DoctorSlice
> = (set, get) => ({
  doctors: [],
  doctorAppointments: [],
  doctorStats: { 
    overview: {
      _id: null,
      totalAppointments: 0,
      confirmedAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      totalRevenue: 0
    },
    graphData: {
      monthly: [],
      daily: [],
      timeSlotDistribution: []
    },
    patientAnalytics: {
      _id: null,
      totalUniquePatients: 0,
      averageAge: null
    },
    periodComparisons: {
      thisMonth: 0,
      thisWeek: 0,
      today: 0
    },
    performanceMetrics: {
      completionRate: "0",
      cancellationRate: "0",
      averageAppointmentsPerDay: "0"
    }
  },
  isLoading: false,
  error: null,
  doctorPatients: [],
  user: null,
  doctorPatientsHistories: {
    totalPatients: 0,
    totalRecords: 0,
    patients: []
  },

  // Fetch all doctors
  fetchDoctors: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getApi('/doctors');
      if (response) {
        set({ doctors: response });
        console.log('Fetched doctors:', response);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch doctors' });
      console.error('Failed to fetch doctors:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new doctor
  createDoctor: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await postApi('/doctors', formData);
      if (response) {
        // Refetch doctors after creation
        await get().fetchDoctors();
        console.log('Created doctor:', response);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to create doctor' });
      console.error('Failed to create doctor:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch doctor appointments
  fetchDoctorAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = useStore.getState().user;

      if (!currentUser?._id) {
        throw new Error('No authenticated doctor found');
      }

      const response = await getApi(`/doctors/${currentUser._id}/appointments`);
      if (response) {
        set({ doctorAppointments: response });
        console.log('Fetched doctor appointments:', response);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch appointments' });
      console.error('Failed to fetch doctor appointments:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch doctor statistics
  fetchDoctorStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = useStore.getState().user;

      if (!currentUser?._id) {
        throw new Error('No authenticated doctor found');
      }

      const response = await getApi(`/doctors/${currentUser._id}/stats`);
      if (response) {
        set({ doctorStats: response });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch stats' });
      console.error('Failed to fetch doctor stats:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch doctor availability
  fetchDoctorAvailability: async (doctorId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getApi(`/doctors/${doctorId}/availability`);
      if (response) {
        // Update the specific doctor's availability in the doctors array
        set({
          doctors: get().doctors.map(doctor =>
            doctor.id === doctorId ? { ...doctor, availability: response } : doctor
          )
        });
        console.log('Fetched doctor availability:', response);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch availability' });
      console.error('Failed to fetch doctor availability:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Update doctor availability
  updateDoctorAvailability: async (doctorId: string, availability: any[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/doctors/${doctorId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability }),
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      const updatedData = await response.json();
      
      // Update the user's availability in the store
      set(state => ({
        user: state.user ? {
          ...state.user,
          availability: updatedData.availability
        } : null
      }));

      return updatedData;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Verify doctor
  verifyDoctor: async (doctorId: string, isValidated: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await putApi(`/admin/verify-doctor/${doctorId}`, { isValidated });
      if (response) {
        set({
          doctors: get().doctors.map(doctor =>
            doctor.id === doctorId ? { ...doctor, isValidated } : doctor
          )
        });
        console.log('Verified doctor:', response);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to verify doctor' });
      console.error('Failed to verify doctor:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete doctor
  deleteDoctor: async (doctorId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteApi(`/doctors/${doctorId}`);
      set({
        doctors: get().doctors.filter(doctor => doctor.id !== doctorId)
      });
      console.log('Deleted doctor:', doctorId);
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete doctor' });
      console.error('Failed to delete doctor:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Update doctor status
  updateDoctorStatus: async (id: string, isValidated: boolean) => {
    try {
      const response = await putApi(`/admin/verify-doctor/${id}`, { isValidated });
      if (response) {
        // Refetch doctors after status update
        await get().fetchDoctors();
      }
    } catch (error) {
      console.error('Failed to update doctor status:', error);
      throw error;
    }
  },

  // Fetch doctor's patients
  fetchDoctorPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = useStore.getState().user;

      if (!currentUser?._id) {
        throw new Error('No authenticated doctor found');
      }

      const response = await getApi(`/doctors/${currentUser._id}/patients`);
      if (response) {
        set({ doctorPatients: response });
        console.log('Fetched doctor patients:', response);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch patients' });
      console.error('Failed to fetch doctor patients:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Add patient record
  addPatientRecord: async (patientData) => {
    set({ isLoading: true, error: null });
    try {
      await postApi('/doctor/patients', patientData);
      // Refetch patients after adding new record
      await get().fetchDoctorPatients();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update patient medical record
  updatePatientRecord: async (patientId, data) => {
    set({ isLoading: true, error: null });
    try {
      await putApi(`/doctor/patients/${patientId}`, data);
      // Refetch patients after updating record
      await get().fetchDoctorPatients();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update patient vitals
  updatePatientVitals: async (patientId, vitals) => {
    set({ isLoading: true, error: null });
    try {
      await putApi(`/doctor/patients/${patientId}/vitals`, vitals);
      // Refetch patients after updating vitals
      await get().fetchDoctorPatients();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Add patient note (diagnosis or treatment)
  addPatientNote: async (patientId, note) => {
    set({ isLoading: true, error: null });
    try {
      await postApi(`/doctor/patients/${patientId}/notes`, note);
      // Refetch patients after adding note
      await get().fetchDoctorPatients();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update appointment status (modify existing function)
  updateAppointmentStatus: async (appointmentId: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => {
    set({ isLoading: true, error: null });
    try {
      const response = await putApi(`/appointments/${appointmentId}/status`, { status });
      if (response) {
        set({
          doctorAppointments: get().doctorAppointments.map(appointment =>
            appointment._id === appointmentId ? { ...appointment, status } : appointment
          )
        });
        console.log('Updated appointment status:', response);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update appointment status' });
      console.error('Failed to update appointment status:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Profile management
  updateDoctorProfile: async (data: FormData | Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      const formData = data instanceof FormData ? data : new FormData();

      if (!(data instanceof FormData)) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
      }

      // Update the profile
      await putApi('/doctors/profile', formData);

      // Fetch the complete updated profile
      const currentUser = useStore.getState().user;
      if (!currentUser?._id) {
        throw new Error('No authenticated doctor found');
      }

      const updatedProfile = await getApi(`/doctors/${currentUser._id}/profile`);
      
      // Update the user state with the complete updated profile
      set(state => ({
        user: updatedProfile
      }));

      return updatedProfile;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateDoctorAvailabilityProfile: async (availability: DoctorAvailability[]) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = useStore.getState().user;
      if (!currentUser?._id) {
        throw new Error('No authenticated doctor found');
      }

      const updatedAvailability = await putApi(`/doctors/${currentUser._id}/availability`, {
        availability
      });

      // Fetch the updated doctor profile
      const updatedProfile = await getApi(`/doctors/${currentUser._id}/profile`);

      // Update the user state with the complete updated profile
      set(state => ({
        user: updatedProfile
      }));

      return updatedAvailability;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch doctor's patients medical histories
  fetchPatientsHistories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getApi('/medical-history/doctor/patients');
      if (response) {
        set({ 
          doctorPatientsHistories: response 
        });
        console.log('Fetched patients medical histories:', response);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch medical histories' });
      console.error('Failed to fetch patients medical histories:', error);
    } finally {
      set({ isLoading: false });
    }
  },
});
