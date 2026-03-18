import api from '@/lib/api';

export const bookingService = {
  // Seeker: Hire a provider
  createBooking: async (data: { 
    skillId: string, 
    providerId: string, 
    appointmentTime: string, // Matches your endpoint requirement
    totalPrice: number, 
    location: string         // Matches your endpoint requirement
  }) => {
    const res = await api.post('/bookings', data);
    return res.data;
  },

  // Fetch existing bookings to check for time conflicts
  getAllBookings: async () => {
    const res = await api.get('/bookings');
    return res.data;
  },

  getMyRequests: async () => {
    const res = await api.get('/bookings/my-requests');
    return res.data;
  },

  getIncomingJobs: async () => {
    const res = await api.get('/bookings/my-jobs');
    return res.data;
  },

  acceptBooking: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/accept`);
    return res.data;
  },

  completeBooking: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/complete`);
    return res.data;
  },

  cancelBooking: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data;
  },
  submitReview: async (reviewData: { bookingId: string, rating: number, comment: string }) => {
    const response = await api.post('/bookings/reviews', reviewData);
    return response.data;
  }
};