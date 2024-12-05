export type Expense = {
  expense_id?: number;
  expense_name: string;
  price: number;
  quantity: number;
  total: number;
  category_id?: number;
  saved_category_id?: number;
};

export type Category = {
  category_id?: number;
  user_id: number;
  category_name: string;
  description: string;
  date?: Date;
  budget: number;
  category_color: string;
  amount_spent: number;
  amount_left: number;
};

export type WeeklySummary = {
  weekly_summary_id?: number;
  date_start: Date;
  date_end: Date;
  total_budget: number;
  total_spent: number;
  total_not_spent: number;
};

export type SavedCategories = {
  saved_category_id: number;
  category_name: string;
  budget: number;
  category_color: string;
  amount_left: number;
  amount_spent: number;
  weekly_summary_id: number;
};

export type User = {
  user_id?: number;
  created_at: Date;
  username: string;
  email: string;
  isNew: boolean;
  decimal_separator: string;
};
