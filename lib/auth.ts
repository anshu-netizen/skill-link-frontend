export const setAuth = (token: string, userData: any) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getAuthToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};