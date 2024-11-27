import ExpenseBox from "@/components/Expense";
import { BackendResponse } from "@/interfaces/response";
import Expense from "@/types/Expense";
import { Category } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useLoaderData } from "react-router-dom";

const CategoryPage = () => {
  const { data: category } = useLoaderData() as BackendResponse<Category>;
  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["category", category.category_id, "expenses"],
    queryFn: () =>
      fetch(
        `http://localhost:3000/category/${category.category_id}/expenses`
      ).then(async (res) => {
        const { data } = (await res.json()) as BackendResponse<Expense[]>;
        console.log(data);
        return data;
      }),
  });
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <h1 className="mb-4 text-center text-2xl font-bold text-black">ho</h1>
      {/* <Link to={"expense/add"}>Add Expense</Link> */}

      <div className="flex w-full flex-col">
        {expenses &&
          expenses.map((expense: Expense) => (
            <ExpenseBox
              category_id={expense.category_id}
              price={expense.price}
              expense_name={expense.expense_name}
              quantity={expense.quantity}
              total={expense.total}
              expense_id={Number(expense.expense_id)}
              key={expense.expense_id}
            />
          ))}
      </div>
      <div></div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default CategoryPage;
