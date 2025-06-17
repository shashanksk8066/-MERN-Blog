const API_BASE_URL = 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = () => {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[❌ API Error] ${url}:`, errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    console.error(`[🔥 Request Failed] ${url}:`, err);
    throw new Error('Server error');
  }
};

// Authentication APIs
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    return makeAuthenticatedRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({username, email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return makeAuthenticatedRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getCurrentUser: async () => {
    return makeAuthenticatedRequest('/api/auth/me');
  },
};

// Blog Post APIs
export const postsAPI = {
  getAllPosts: async (filters: {
    search?: string;
    category?: string;
    tags?: string[];
  } = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.tags) {
      filters.tags.forEach(tag => params.append('tags[]', tag));
    }

    const queryString = params.toString();
    const url = queryString ? `/api/posts?${queryString}` : '/api/posts';

    return makeAuthenticatedRequest(url);
  },

  getPostById: async (id: string) => {
    return makeAuthenticatedRequest(`/api/posts/${id}`);
  },

  createPost: async (postData: {
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    image?: string;
  }) => {
    return makeAuthenticatedRequest('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  updatePost: async (id: string, postData: any) => {
    return makeAuthenticatedRequest(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  deletePost: async (id: string) => {
    return makeAuthenticatedRequest(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Comment APIs
export const commentsAPI = {
  getCommentsByPost: async (postId: string) => {
    return makeAuthenticatedRequest(`/api/comments/${postId}`);
  },

  addComment: async (postId: string, content: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return makeAuthenticatedRequest(`/api/comments/${postId}`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        author: user.username || 'Anonymous',
        authorAvatar: user.avatar || '',
      }),
    });
  },

  deleteComment: async (commentId: string) => {
    return makeAuthenticatedRequest(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Categories & Tags APIs
export const categoriesAPI = {
  getAllCategories: async () => {
    return makeAuthenticatedRequest('/api/categories');
  },

  getAllTags: async () => {
    return makeAuthenticatedRequest('/api/tags');
  },
};
