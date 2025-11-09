import axios from 'axios';

const API_URL = '/api';

export const register = (username, email, password) => {
    return axios.post(`${API_URL}/auth/register/`, {
        username, email, password
    });
};

export const login = (username, password) => {
    return axios.post(`${API_URL}/auth/login/`, {
        username, password
    });
};

export const logout = () => {
    return axios.post(`${API_URL}/auth/logout/`);
};

export const getActivities = () => {
    return axios.get(`${API_URL}/activities/`);
};

export const createActivity = (data) => {
    return axios.post(`${API_URL}/activities/`, data);
};

export const updateActivity = (id, data) => {
    return axios.put(`${API_URL}/activities/${id}/`, data);
};

export const deleteActivity = (id) => {
    return axios.delete(`${API_URL}/activities/${id}/`);
};