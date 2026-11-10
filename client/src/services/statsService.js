import api from './api';

export const statsService = {
  async getDashboardStats() {
    const res = await api.get('/stats/dashboard');
    return res.data;
  },

  async getPlatformStats() {
    const res = await api.get('/stats/platform');
    return res.data;
  },
};

export const reviewService = {
  async submitReview(reviewData) {
    const res = await api.post('/reviews', reviewData);
    return res.data;
  },

  async getItemReviews(itemId) {
    const res = await api.get(`/reviews/item/${itemId}`);
    return res.data;
  },

  async getUserReviews(userId) {
    const res = await api.get(`/reviews/user/${userId}`);
    return res.data;
  },
};
