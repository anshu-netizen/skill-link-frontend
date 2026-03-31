import api from '@/lib/api';

export interface UserData {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
}

export const userService = {
  
  // 1. Fetch all users
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // 2. Fetch single user by ID (PROFILE)
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id: string, updateData: any) => {
  const response = await api.patch(`/users/${id}`, updateData);
  return response.data;
},
};