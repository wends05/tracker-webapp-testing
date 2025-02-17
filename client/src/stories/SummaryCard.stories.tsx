import type { Meta, StoryObj } from "@storybook/react";
import SummaryCard from "../components/SummaryCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


const meta: Meta<typeof SummaryCard> = {
  component: SummaryCard,
  args: {
    summary: {
      weekly_summary_id: 123,
      date_start: new Date(),
      date_end: new Date(),
      total_budget: 0,
      total_spent: 0,
      total_not_spent: 0
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
      weekly_summary_id: 123,
      date_start: new Date(),
      date_end: new Date(),
      total_budget: 500,
      total_spent: 400,
      total_not_spent: 100
    },
  },
};
