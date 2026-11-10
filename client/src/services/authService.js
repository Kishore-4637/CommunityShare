import api from './api';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },

  async toggleWishlist(itemId) {
    const res = await api.post(`/auth/wishlist/${itemId}`);
    return res.data;
  },

  async getWishlist() {
    const res = await api.get('/auth/wishlist');
    return res.data;
  },

  async getDemoUsers() {
    const res = await api.get('/auth/demo-users');
    return res.data;
  },
};
