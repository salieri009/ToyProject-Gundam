export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}