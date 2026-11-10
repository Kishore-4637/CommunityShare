import api from './api';

export const chatService = {
  async getConversations() {
    const res = await api.get('/messages/conversations');
    return res.data;
  },

  async getMessages(targetUserId) {
    const res = await api.get(`/messages/${targetUserId}`);
    return res.data;
  },

  async sendMessage(recipientId, text, itemId = null) {
    const res = await api.post('/messages', { recipientId, text, itemId });
    return res.data;
  },
};
