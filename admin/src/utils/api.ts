import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://mern-blog-xu5s.onrender.com'; // 🔁 Replace this if backend is hosted elsewhere

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request Interceptor: Attach token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('adminToken');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Optional: Log every request
  console.log('✅ API Request:', config.method?.toUpperCase(), config.url);

  return config;
});

// ⚠️ Response Interceptor: Log and handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    console.error('❌ API Error:', status || 'NO_RESPONSE', data || error.message);

    return Promise.reject({
      status,
      message: data?.message || error.message || 'Unexpected error',
    });
  }
);

// ✨ Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/admin/login', credentials),

  getProfile: () => api.get('/api/profile'),
};

// 📝 Blog API
export const blogAPI = {
  getAllBlogs: () => api.get('/api/admin/blogs'),
  getBlog: (id: string) => api.get(`/api/admin/blogs/${id}`),
  createBlog: (blogData: any) => api.post('/api/admin/blogs', blogData),
  updateBlog: (id: string, blogData: any) => api.put(`/api/admin/blogs/${id}`, blogData),
  deleteBlog: (id: string) => api.delete(`/api/admin/blogs/${id}`),
};

// 👥 User API
export const userAPI = {
  getAllUsers: () => api.get('/api/admin/users'),
  makeAdmin: (userId: string) => api.post(`/api/admin/make-admin/${userId}`),
};

export default api;
