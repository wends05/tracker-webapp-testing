import type { Meta, StoryObj } from "@storybook/react";

import Sorter from "../components/Sorter";
import { Category } from "@/utils/types";
import { fn } from "@storybook/test";


const sampleCategories: Category[] = [
  {
    amount_left: 100,
    amount_spent: 0,
    budget: 100,
    category_color: "#FF0000",
    category_name: "Food",
    description: "Food and Groceries",
    user_id: 1,
    category_id: 1,
  }
]

const meta = {
  component: Sorter,
  args: {
    categories: sampleCategories,
    onSort: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sorter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    categories: [],
  }
};
