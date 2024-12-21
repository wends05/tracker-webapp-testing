import ExpenseBox from "@/components/ExpenseBox";
import { BackendResponse } from "@/interfaces/BackendResponse";
import calculatePercentages from "@/utils/calculateCategoryPercentages";
import { Expense, SavedCategories } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, Link, useParams } from "react-router-dom";

const SavedCategoryPage = () => {
  const { saved_category_id } = useParams();

  const { data: category } = useQuery<SavedCategories>({
    queryKey: ["savedCategory", saved_category_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/savedCategories/${saved_category_id}`
      );

      if (!response.ok) {
        const { message } = (await response.json()) as { message: string };
        throw Error(message);
      }

      const { data } =
        (await response.json()) as BackendResponse<SavedCategories>;
      return data;
    },
  });

  const { data: savedCategoryExpenses } = useQuery<Expense[]>({
    enabled: !!category,
    queryKey: ["savedCategory", category?.saved_category_id, "expenses"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/savedCategories/${category?.saved_category_id}/expenses`
      );
      if (!response.ok) {
        const { message } = (await response.json()) as { message: string };
        throw Error(message);
      }

      const { data } = (await response.json()) as BackendResponse<Expense[]>;
      return data;
    },
  });

  const [sortHighLow, setsortHighLow] = useState(false);
  const [sortLowHigh, setsortLowHigh] = useState(false);
  const [ascending, setAscending] = useState<Expense[] | null>(null);
  const [descending, setDescending] = useState<Expense[] | null>(null);

  const ascendingSorted = () => {
    const sorted = [...(savedCategoryExpenses || [])].sort(
      (a, b) => a.price - b.price
    );
    setAscending(sorted);
  };

  const descendingSorted = () => {
    const sorted = [...(savedCategoryExpenses || [])].sort(
      (a, b) => b.price - a.price
    );
    setDescending(sorted);
  };

  const [{ savedPercentage, spentPercentage }, setCategoryPercentages] =
    useState<{
      savedPercentage: number;
      spentPercentage: number;
    }>({
      savedPercentage: 0,
      spentPercentage: 0,
    });

  useEffect(() => {
    if (category) {
      const { savedPercentage, spentPercentage } = calculatePercentages(
        category.budget,
        category.amount_spent,
        category.amount_left
      );

      setCategoryPercentages({
        savedPercentage,
        spentPercentage,
      });
    }
  }, [category]);

  return !saved_category_id || !category || !savedCategoryExpenses ? (
    <>loading</>
  ) : (
    <div className="relative mx-auto mt-4 flex min-h-screen w-full max-w-screen-lg flex-col justify-center px-4 sm:mt-6 sm:px-6 lg:mt-8 lg:px-8">
      <h1 className="w-full text-center text-4xl font-bold text-black sm:text-5xl md:text-7xl lg:text-8xl">
        {category.category_name}
      </h1>

      <div className="mt-8 flex w-full flex-wrap justify-between gap-4">
        <div className="flex w-full flex-col items-center lg:w-1/3">
          <div className="min-h-56 w-full rounded-3xl bg-white drop-shadow-lg">
            <div
              className="flex h-12 items-center rounded-t-2xl px-6 font-bold text-white"
              style={{
                backgroundColor: category.category_color,
              }}
            >
              <span>Description</span>
            </div>
            <p className="ml-6 mt-4 text-sm sm:text-base">
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center lg:w-1/3">
          <div
            className="h-16 w-full rounded-3xl bg-white p-4 text-center text-white drop-shadow-lg"
            style={{
              backgroundColor: category.category_color,
            }}
          >
            <span>Total Budget: </span>
            <span className="text-xl font-bold sm:text-2xl">
              ₱{category.budget}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="text-center">
              <span>Total Saved</span>
              <p className="text-4xl font-bold sm:text-6xl">
                {savedPercentage.toFixed(0)}%
              </p>
              <p className="font-bold">₱{category.amount_left}</p>
            </div>
            <div className="text-center">
              <span>Total Spent</span>
              <p className="text-4xl font-bold sm:text-6xl">
                {spentPercentage.toFixed(0)}%
              </p>
              <p className="font-bold">₱{category.amount_spent}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-4 flex w-full flex-wrap justify-center gap-4 px-4 sm:px-8">
        <button
          className={`rounded-full border-2 px-4 py-2 text-sm ${
            sortHighLow ? "text-white" : ""
          }`}
          style={{
            borderColor: category.category_color,
            backgroundColor: sortHighLow ? category.category_color : "white",
            color: sortHighLow ? "white" : category.category_color,
          }}
          onClick={() => {
            setsortHighLow(!sortHighLow);
            setsortLowHigh(false);
            descendingSorted();
          }}
        >
          Sort By: Descending Expense
        </button>
        <button
          className={`rounded-full border-2 px-4 py-2 text-sm ${
            sortLowHigh ? "text-white" : ""
          }`}
          style={{
            borderColor: category.category_color,
            backgroundColor: sortLowHigh ? category.category_color : "white",
            color: sortLowHigh ? "white" : category.category_color,
          }}
          onClick={() => {
            setsortLowHigh(!sortLowHigh);
            setsortHighLow(false);
            ascendingSorted();
          }}
        >
          Sort By: Ascending Expense
        </button>
      </div>

      <div className="flex w-full flex-col gap-4 px-4 sm:px-8">
        <Link to={"expense/add"}>
          <div
            className="h-16 w-full rounded-3xl bg-white p-4 text-center text-white drop-shadow-lg"
            style={{
              backgroundColor: category.category_color,
            }}
          >
            Add Expense
          </div>
        </Link>

        {(sortHighLow
          ? descending
          : sortLowHigh
            ? ascending
            : savedCategoryExpenses
        )?.map((expense) => (
          <ExpenseBox
            date={expense.date}
            category_id={expense.category_id}
            price={expense.price}
            expense_name={expense.expense_name}
            quantity={expense.quantity}
            total={expense.total}
            expense_id={Number(expense.expense_id)}
            saved_category_id={Number(expense.saved_category_id)}
            key={expense.expense_id}
          />
        ))}
      </div>

      <Outlet />
    </div>
  );
};

export default SavedCategoryPage;
