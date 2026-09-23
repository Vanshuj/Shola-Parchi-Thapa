import axiosClient from './axiosClient';
export const roomApi = {
    create: (maxPlayers, isPrivate) => axiosClient.post('/rooms', { maxPlayers, isPrivate }).then((r) => r.data),
    get: (code) => axiosClient.get(`/rooms/${code}`).then((r) => r.data),
    join: (code) => axiosClient.post(`/rooms/${code}/join`).then((r) => r.data),
    leave: (code) => axiosClient.post(`/rooms/${code}/leave`),
    start: (code) => axiosClient.post(`/rooms/${code}/start`).then((r) => r.data),
};
