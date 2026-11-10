import api from './api';

export const requestService = {
  async createRequest(requestData) {
    const res = await api.post('/requests', requestData);
    return res.data;
  },

  async getIncomingRequests() {
    const res = await api.get('/requests/incoming');
    return res.data;
  },

  async getOutgoingRequests() {
    const res = await api.get('/requests/outgoing');
    return res.data;
  },

  async updateRequestStatus(id, status, rejectionReason = '') {
    const res = await api.put(`/requests/${id}/status`, { status, rejectionReason });
    return res.data;
  },
};
