import axiosClient from './axiosClient';
export const preferenceApi = {
    get: () => axiosClient.get('/users/me/preferences').then((r) => r.data),
    update: (partial) => axiosClient.put('/users/me/preferences', partial).then((r) => r.data),
};
