import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { User } from "./types";
import getUser from "./fetchuser";

export const getCategory = (queryClient: QueryClient) => {
  return async ({ params: { category } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["category", category],
      queryFn: () =>
        fetch(`${process.env.SERVER_URL}/category/${category}`).then((res) =>
          res.json()
        ),
    });
  };
};

export const getCategories = (queryClient: QueryClient) => {
  return async () => {
    const userData = (await queryClient.ensureQueryData({
      queryKey: ["user"],
      queryFn: getUser,
    })) as User;
    return await queryClient.ensureQueryData({
      queryKey: ["categories"],
      queryFn: () =>
        fetch(
          `${process.env.SERVER_URL}/user/${userData.user_id!}/categories`
        ).then((res) => res.json()),
    });
  };
};

export const getExpense = (queryClient: QueryClient) => {
  return async ({ params: { expense } }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData({
      queryKey: ["expense", expense],
      queryFn: () =>
        fetch(`${process.env.SERVER_URL}/expense/${expense}`).then((res) =>
          res.json()
        ),
    });
  };
};
