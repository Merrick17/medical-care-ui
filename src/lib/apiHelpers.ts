import axios from 'axios';
import useStore from '@/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = useStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleError = (error: any) => {
  console.log("Error",error);
  // if (error.response) {
  //   throw  Error(error.response.data.message || 'An error occurred');
  // } else if (error.request) {
  //   throw  Error('No response received from server');
  // } else {
  //   throw  Error('Error setting up request');
  // }
};

export const getApi = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const postApi = async (endpoint: string, data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const putApi = async (endpoint: string, data: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteApi = async (endpoint: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Special handler for file uploads
export const uploadApi = async (endpoint: string, formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};