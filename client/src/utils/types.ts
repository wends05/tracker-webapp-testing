// utils/types.ts or interfaces/types.ts
export interface Expense {
  expense_id?: number;
  expense_name: string;
  price: number;
  quantity: number;
  total: number;
  category_id?: number;
  date?: Date;
  saved_category_id?: number;
}

export interface Category {
  category_id?: number;
  user_id: number;
  category_name: string;
  description: string;
  budget: number;
  category_color: string;
  amount_spent: number;
  amount_left: number;
}

export interface WeeklySummary {
  weekly_summary_id: number;
  date_start: Date;
  date_end: Date;
  total_budget: number;
  total_spent: number;
  total_not_spent: number;
  user_id?: number;
}

export interface SavedCategories {
  saved_category_id?: number;
  category_name: string;
  description: string;
  budget: number;
  category_color: string;
  amount_left: number;
  amount_spent: number;
  weekly_summary_id: number;
}

export interface User {
  user_id?: number;
  created_at: Date;
  username: string;
  email: string;
  isNew: boolean;
  decimal_separator: string;
}
