import axiosClient from './axiosClient';
export const labelApi = {
    getLabels: () => axiosClient.get('/users/me/labels').then((r) => r.data.labels),
    updateLabels: (labels) => axiosClient.put('/users/me/labels', { labels }).then((r) => r.data.labels),
    updateOne: (cardType, label) => axiosClient.put(`/users/me/labels/${cardType}`, { label }).then((r) => r.data),
    reset: () => axiosClient.delete('/users/me/labels'),
    presets: () => axiosClient.get('/labels/presets').then((r) => r.data),
};
