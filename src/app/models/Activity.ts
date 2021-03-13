export class Activity {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  language: string;
  date: string;
  user: number;
  price: number;
  registered: Array<number> = [];
}
