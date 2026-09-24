import axiosClient from './axiosClient';

export const authApi = {
  register: (username, email, password) => {
    if (typeof username === 'object' && username !== null) {
      return axiosClient.post('/auth/register', username).then((r) => r.data);
    }
    return axiosClient.post('/auth/register', { username, email, password }).then((r) => r.data);
  },
  login: (email, password) =>
    axiosClient.post('/auth/login', { email, password }).then((r) => r.data),
};
