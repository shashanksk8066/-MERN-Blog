
export interface BlogPost {
   _id: string;
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  image?: string;
  commentsCount: number;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  joinedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
