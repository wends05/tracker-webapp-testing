import Sidebar from "@/components/Sidebar";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Sidebar,
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
}