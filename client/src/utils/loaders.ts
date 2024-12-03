import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";

export const getCategory = (queryClient: QueryClient) => {
  return async ({ params: { category_id } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["category", category_id],
      queryFn: () =>
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/category/${category_id}`
        ).then((res) => res.json()),
    });
  };
};

export const getExpense = (queryClient: QueryClient) => {
  return async ({ params: { expense_id } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["expense", expense_id],
      queryFn: () =>
        fetch(`${import.meta.env.VITE_SERVER_URL}/expense/${expense_id}`).then(
          (res) => res.json()
        ),
    });
  };
};
