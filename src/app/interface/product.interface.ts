/*
@description: Product Interface
*/
export interface Product {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  imageCover: string;
}

/*
@description: Product Response Interface
*/
export interface ProductResponse {
  status: string;
  message: string;
  data: { products: Product[] };
}

/*
@description: Product Cart Interface
*/
export interface ProductCart {
  count: number;
  _id: string;
  product: Product;
  price: number;
}
