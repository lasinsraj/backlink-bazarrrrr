export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  features?: string[];
  image_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
}