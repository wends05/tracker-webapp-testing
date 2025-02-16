import type { Meta, StoryObj } from "@storybook/react";
import SummaryCard from "../components/SummaryCard";
import { Category } from "@/utils/types";
import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new QueryClient instance
const queryClient = new QueryClient();

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
  },
];

const meta: Meta<typeof SummaryCard> = {
  component: SummaryCard,
  args: {
    summary: {
      categories: sampleCategories,
      onSort: fn(),
      weekly_summary_id: 123,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    summary: {
      categories: [],
      onSort: fn(),
      weekly_summary_id: 123,
    },
  },
};
