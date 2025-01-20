import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createDepartmentSlice, DepartmentSlice } from './slices/departmentSlice';
import { createAppointmentSlice, AppointmentSlice } from './slices/appointmentSlice';
import { createDoctorSlice, DoctorSlice } from './slices/doctorSlice';
import { createPatientSlice, PatientSlice } from './slices/patientSlice';

// Combine all slice interfaces
interface StoreState extends 
  AuthSlice,
  DepartmentSlice,
  AppointmentSlice,
  DoctorSlice,
  PatientSlice {}

// Create the store with all slices
const useStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createDepartmentSlice(...a),
      ...createAppointmentSlice(...a),
      ...createDoctorSlice(...a),
      ...createPatientSlice(...a),
    }),
    { name: 'store' }
  )
);

export default useStore;