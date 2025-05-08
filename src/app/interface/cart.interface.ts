/*
@description: Cart Product Interface
*/
export interface CartProduct {
  count: number;
  _id: string;
  product: {
    subcategory: Array<{
      _id: string;
      name: string;
      slug: string;
      category: string;
    }>;
    _id: string;
    title: string;
    quantity: number;
    imageCover: string;
    category: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
    brand: string | null;
    ratingsAverage: number;
    id: string;
  };
  price: number;
}

/*
@description: Cart Data Interface
*/
export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

/*
@description: Cart Response Interface
*/
export interface CartResponse {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}
