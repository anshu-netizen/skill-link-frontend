import api from '@/lib/api';

/**
 * SkillData remains for cases where you might need 
 * to type the response or simple updates.
 */
export interface SkillData {
  _id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location?: string;
  tags?: string[];
  images?: string[];
  availability?: string;
}

export const skillService = {
  
  // 1. Fetch only skills belonging to the logged-in user
  getMySkills: async () => {
    const response = await api.get('/skills/my-skills');
    return response.data;
  },

  // 2. Fetch all skills for the public marketplace
  getAllSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  // 3. Fetch a single skill by its ID
  getSkillById: async (id: string) => {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  },

  /**
   * 4. Create a new skill
   * Updated to accept FormData to support image uploads.
   * Axios will automatically set the correct 'Content-Type' header.
   */
  createSkill: async (skillData: FormData) => {
    const response = await api.post('/skills', skillData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 5. Update an existing skill
  updateSkill: async (id: string, updateData: Partial<SkillData>) => {
    const response = await api.patch(`/skills/${id}`, updateData);
    return response.data;
  },

  // 6. Toggle availability status
  toggleStatus: async (id: string, status: 'Available' | 'Busy') => {
    const response = await api.patch(`/skills/${id}/status`, { availability: status });
    return response.data;
  },

  // 7. Remove a service listing
  deleteSkill: async (id: string) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  }
};