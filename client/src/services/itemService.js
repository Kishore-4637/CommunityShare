import api from './api';

export const itemService = {
  async getItems(params = {}) {
    const res = await api.get('/items', { params });
    return res.data;
  },

  async getFeaturedItems() {
    const res = await api.get('/items/featured');
    return res.data;
  },

  async getItemById(id) {
    const res = await api.get(`/items/${id}`);
    return res.data;
  },

  async getSimilarItems(id) {
    const res = await api.get(`/items/${id}/similar`);
    return res.data;
  },

  async getMyListings() {
    const res = await api.get('/items/user/my-listings');
    return res.data;
  },

  async createItem(formData) {
    const res = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async updateItem(id, formData) {
    const res = await api.put(`/items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async deleteItem(id) {
    const res = await api.delete(`/items/${id}`);
    return res.data;
  },
};
