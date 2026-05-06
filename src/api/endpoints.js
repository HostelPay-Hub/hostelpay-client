import axiosClient from './axiosClient';

export const authAPI = {
  login: (data) => axiosClient.post('/auth/login', data),
  registerOwner: (data) => axiosClient.post('/auth/register-owner', data),
  claimStudent: (data) => axiosClient.post('/auth/claim-student', data),
  checkHealth: () => axiosClient.get('/auth/health'),
};

export const dashboardAPI = {
  getMetrics: () => axiosClient.get('/dashboard/metrics'),
  getPendingDues: () => axiosClient.get('/dashboard/pending-dues'),
};

export const studentAPI = {
  getAll: () => axiosClient.get('/students'),
  getById: (id) => axiosClient.get(`/students/${id}`),
  create: (data) => axiosClient.post('/students', data),
  update: (id, data) => axiosClient.put(`/students/${id}`, data),
  delete: (id) => axiosClient.delete(`/students/${id}`),
  getDashboard: () => axiosClient.get('/students/me/dashboard'),
};

export const roomAPI = {
  getAll: () => axiosClient.get('/rooms'),
  create: (data) => axiosClient.post('/rooms', data),
  update: (id, data) => axiosClient.put(`/rooms/${id}`, data),
  delete: (id) => axiosClient.delete(`/rooms/${id}`),
};

export const leaseAPI = {
  getAll: () => axiosClient.get('/leases'),
  getByStudent: (studentId) => axiosClient.get(`/leases/student/${studentId}`),
  create: (data) => axiosClient.post('/leases', data),
  delete: (id) => axiosClient.delete(`/leases/${id}`),
  assign: (data) => axiosClient.post('/leases/assign', data),
};

export const paymentAPI = {
  getAll: () => axiosClient.get('/payments'),
  getByStudent: (studentId) => axiosClient.get(`/payments/student/${studentId}`),
  record: (data) => axiosClient.post('/payments', data),
  delete: (id) => axiosClient.delete(`/payments/${id}`),
};

export const adminAPI = {
  getAllHostels: () => axiosClient.get('/admin/hostels'),
  toggleSubscription: (id, active) => axiosClient.put(`/admin/hostels/${id}/subscription?active=${active}`),
};

export const hostelAPI = {
  getMe: () => axiosClient.get('/hostels/me'),
  updateMe: (data) => axiosClient.put('/hostels/me', data),
};
