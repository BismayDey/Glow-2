import { Timestamp } from "firebase/firestore";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  rating: number;
  stock: number;
  isNew: boolean;
  discount: number;
  quantity?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  date: Timestamp;
}
