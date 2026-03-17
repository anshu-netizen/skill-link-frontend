import api from '@/lib/api';

/**
 * SkillService handles all communication with the /api/skills endpoints.
 * It automatically uses the Bearer token configured in your Axios instance.
 */

export interface SkillData {
  title: string;
  description: string;
  category: string;
  price: number;
  availability?: string;
}

export const skillService = {
  
  // 1. Fetch only skills belonging to the logged-in user (Anshu Dalal)
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

  // 4. Create a new skill (Used by your FullPageAddSkill component)
  createSkill: async (skillData: SkillData) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },

  // 5. Update an existing skill (Update price, description, or title)
  updateSkill: async (id: string, updateData: Partial<SkillData>) => {
    const response = await api.patch(`/skills/${id}`, updateData);
    return response.data;
  },

  // 6. Toggle availability status (e.g., "Available" vs "Busy")
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