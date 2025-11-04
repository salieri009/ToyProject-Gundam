import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API calls
export const authAPI = {
  googleLogin: async (idToken: string) => {
    const response = await api.post('/auth/google', { id_token: idToken });
    return response.data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Posts API calls
export const postsAPI = {
  getPosts: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getPost: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  
  createPost: async (title: string, content: string) => {
    const response = await api.post('/posts', { title, content });
    return response.data;
  },
  
  updatePost: async (id: string, title: string, content: string) => {
    const response = await api.put(`/posts/${id}`, { title, content });
    return response.data;
  },
  
  deletePost: async (id: string) => {
    await api.delete(`/posts/${id}`);
  },
};

// Comments API calls
export const commentsAPI = {
  getComments: async (postId: string) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },
  
  createComment: async (postId: string, content: string, parentId?: string) => {
    const response = await api.post(`/posts/${postId}/comments`, {
      content,
      parent_id: parentId,
    });
    return response.data;
  },
  
  updateComment: async (commentId: string, content: string) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
  
  deleteComment: async (commentId: string) => {
    await api.delete(`/comments/${commentId}`);
  },
};
