export type User = {
  _id: string;
  name: string;
  email: string;
  role: "seeker" | "provider";

  phone?: string;
  experience?: number;
  skills?: string[];

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  profile?: {
    bio?: string;
    profileImage?: string;
  };

  createdAt?: string;
  updatedAt?: string;
};