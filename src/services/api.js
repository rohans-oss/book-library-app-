import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export const booksAPI = {
  getAll: async () => {
    const response = await api.get('/books');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  getContent: async (id) => {
    const response = await api.get(`/books/${id}/content`);
    return response.data;
  },
  create: async (book) => {
    const response = await api.post('/books', book);
    return response.data;
  },
  update: async (id, book) => {
    const response = await api.put(`/books/${id}`, book);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/books/${id}`);
  },
};

export const favoritesAPI = {
  add: async (bookId, userId) => {
    await api.post(`/favorites/${bookId}`, { userId });
  },
  remove: async (bookId, userId) => {
    await api.delete(`/favorites/${bookId}`, { data: { userId } });
  },
};

export const readAPI = {
  add: async (bookId, userId) => {
    await api.post(`/read/${bookId}`, { userId });
  },
  remove: async (bookId, userId) => {
    await api.delete(`/read/${bookId}`, { data: { userId } });
  },
};

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  }
};

export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};
