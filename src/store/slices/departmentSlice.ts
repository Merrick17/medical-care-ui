import { StateCreator } from 'zustand';
import { Department } from '../types';
import { getApi, postApi, putApi, deleteApi } from '@/lib/apiHelpers';

export interface DepartmentSlice {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  addDepartment: (department: Partial<Department>) => Promise<void>;
  updateDepartment: (id: string, department: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
}

export const createDepartmentSlice: StateCreator<DepartmentSlice> = (set, get) => ({
  departments: [],
  isLoading: false,
  error: null,

  fetchDepartments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getApi('/departments');
      const departmentsData = response.data || response;
      set({ departments: departmentsData });
      console.log('Fetched departments:', departmentsData);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch departments' });
      console.error('Failed to fetch departments:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addDepartment: async (department) => {
    set({ isLoading: true, error: null });
    try {
      await postApi('/departments', department);
      // Refetch departments after adding
      await get().fetchDepartments();
    } catch (error: any) {
      set({ error: error.message || 'Failed to add department' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateDepartment: async (id, department) => {
    set({ isLoading: true, error: null });
    try {
      await putApi(`/departments/${id}`, department);
      // Refetch departments after updating
      await get().fetchDepartments();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update department' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDepartment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteApi(`/departments/${id}`);
      // Refetch departments after deleting
      await get().fetchDepartments();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete department' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
});
