export interface ProductResponse {

  id: string;
  name: string;
  amount: number;
  description: string;
  price: string;
  category_id?: string;
  category: {
    id: string;
    name: string;
  }
}
