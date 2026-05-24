import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

// Response interceptor - Handle errors globally and auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 이고 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/auth/google') {
        // refresh 또는 로그인 API 자체가 401이면 클리어 후 로그인 페이지로 이동
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 큐에 저장 후 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        localStorage.setItem('auth_token', newAccessToken);

        // 대기 중인 요청들 처리
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // 원본 요청 재호출
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // 리프레시 실패 시 로그아웃 처리
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      }
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
