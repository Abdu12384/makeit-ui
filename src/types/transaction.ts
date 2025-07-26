export interface Transaction {
  _id: string;
  paymentType: string;
  amount: number;
  date: string;
  paymentStatus: string;
  description: string;
  vendor?: string;
  service?: string;
  relatedTitle?: string;
}