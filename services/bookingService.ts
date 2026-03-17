import api from '@/lib/api';

export const bookingService = {
  // Seeker: Hire a provider
  createBooking: async (data: { 
    skillId: string, 
    providerId: string, 
    scheduledDate: string, 
    totalPrice: number, 
    message?: string 
  }) => {
    const res = await api.post('/bookings', data);
    return res.data;
  },

  // Seeker: View status of sent requests
  getMyRequests: async () => {
    const res = await api.get('/bookings/my-requests');
    return res.data;
  },

  // Provider: View incoming jobs
  getIncomingJobs: async () => {
    const res = await api.get('/bookings/my-jobs');
    return res.data;
  },

  // Provider: Accept a job
  acceptBooking: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/accept`);
    return res.data;
  },

  // Provider: Complete a job
  completeBooking: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/complete`);
    return res.data;
  },

  // Seeker: Cancel a pending request
  cancelBooking: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data;
  }
};