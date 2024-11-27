export type Expense = {
  expense_id?: number;
  expense_name: string;
  price: number;
  quantity: number;
  total: number;
  category_id: number;
};

export type Category = {
  category_id?: number;
  user_id: number;
  category_name: string;
  description: string;
  budget: number;
  category_color: string;
  amount_spent: number;
  amount_left: number;
};

export type WeeklySummary = {
  date_start: Date;
  date_end: Date;
  total_budget: number;
  total_spent: number;
  total_not_spent: number;
};

export type SavedCategories = Category;

export type WeeklySummarySavedCategories = {
  id: number;
  weekly_summary_id: number;
  saved_category_id: number;
};

export type User = {
  user_id?: number;
  created_at: Date;
  username: string;
  email: string;
  isNew: boolean;
  decimal_separator: string;
};
