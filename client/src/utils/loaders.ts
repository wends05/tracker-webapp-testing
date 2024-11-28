import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";

export const getCategory = (queryClient: QueryClient) => {
  return async ({ params: { category } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["category", category],
      queryFn: () =>
        fetch(`http://localhost:3000/category/${category}`).then((res) =>
          res.json()
        ),
    });
  };
};

export const getExpense = (queryClient: QueryClient) => {
  return async ({ params: { expense } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["expense", expense],
      queryFn: () =>
        fetch(`http://localhost:3000/expense/${expense}`).then((res) =>
          res.json()
        ),
    });
  };
};
