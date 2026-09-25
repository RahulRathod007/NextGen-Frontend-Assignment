import axiosInstance from './axios';
import type { AxiosRequestConfig } from 'axios';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  images: string[];
  brand?: string;
  reviews?: Review[];
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type ProductPayload = Partial<
  Pick<
    Product,
    | 'title'
    | 'description'
    | 'price'
    | 'stock'
    | 'category'
    | 'rating'
    | 'discountPercentage'
    | 'thumbnail'
    | 'images'
  >
>;

export const authApi = {
  login: (username: string, password: string, config?: AxiosRequestConfig) =>
    axiosInstance.post<LoginResponse>('/auth/login', { username, password }, config),
};

export const productApi = {
  getProducts: (limit = 10, skip = 0, config?: AxiosRequestConfig) =>
    axiosInstance.get<ProductsResponse>('/products', {
      ...config,
      params: { limit, skip, ...config?.params },
    }),

  searchProducts: (query: string, limit = 10, skip = 0, config?: AxiosRequestConfig) =>
    axiosInstance.get<ProductsResponse>('/products/search', {
      ...config,
      params: { q: query, limit, skip, ...config?.params },
    }),

  getProductsByCategory: (
    category: string,
    limit = 10,
    skip = 0,
    config?: AxiosRequestConfig
  ) =>
    axiosInstance.get<ProductsResponse>(`/products/category/${category}`, {
      ...config,
      params: { limit, skip, ...config?.params },
    }),

  getProductById: (id: number, config?: AxiosRequestConfig) =>
    axiosInstance.get<Product>(`/products/${id}`, config),

  /** Use category-list (string[]) — /products/categories returns objects. */
  getCategories: (config?: AxiosRequestConfig) =>
    axiosInstance.get<string[]>('/products/category-list', config),

  addProduct: (product: ProductPayload, config?: AxiosRequestConfig) =>
    axiosInstance.post<Product>('/products/add', product, config),

  updateProduct: (id: number, product: ProductPayload, config?: AxiosRequestConfig) =>
    axiosInstance.put<Product>(`/products/${id}`, product, config),

  deleteProduct: (id: number, config?: AxiosRequestConfig) =>
    axiosInstance.delete<{ id: number; isDeleted: boolean }>(`/products/${id}`, config),
};
