import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";

export const getCategory = (queryClient: QueryClient) => {
  return async ({ params: { category } }: LoaderFunctionArgs) => {
    const data = await queryClient.fetchQuery({
      queryKey: ["category", category],
      queryFn: () => fetch(`http://localhost:3000/category/${category}`),
    });
    console.log(data);
    if (!data.ok) {
      throw Error("Category not Found");
    }
    return data;
  };
};
