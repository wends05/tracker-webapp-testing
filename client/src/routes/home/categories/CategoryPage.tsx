import ExpenseBox from "@/components/ExpenseBox";
import WeeklyFilterDropdown from "@/components/WeeklyFilterDropdown";
import { BackendResponse } from "@/interfaces/BackendResponse";
import calculatePercentages from "@/utils/calculateCategoryPercentages";
import { Category, Expense } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { ArrowDown } from "lucide-react";
import { ArrowUp } from "lucide-react";

const CategoryPage = () => {
  const { category_id } = useParams();

  const [sortHighLow, setsortHighLow] = useState(false);
  const [sortLowHigh, setsortLowHigh] = useState(false);

  const [descending, setdescending] = useState<Expense[]>([]);
  const [ascending, setascending] = useState<Expense[]>([]);

  const [selectedDay, setSelectedDay] = useState("None");
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  const { data: category } = useQuery<Category>({
    queryKey: ["category", category_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category_id}`
      );

      if (!response.ok) {
        const { message: errorMessage } = (await response.json()) as {
          message: string;
        };
        throw Error(errorMessage);
      }

      const { data } = (await response.json()) as BackendResponse<Category>;
      return data;
    },
  });

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["category", category_id, "expenses"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category_id}/expenses`
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw Error(errorMessage);
      }

      const { data } = await response.json();
      return data;
    },
  });

  const descendingSorted = () => {
    if (expenses) {
      const sortedExpenses = [...expenses].sort((a, b) =>
        a.total > b.total ? -1 : 1
      );
      setdescending(sortedExpenses);
    }
  };

  const ascendingSorted = () => {
    if (expenses) {
      const sortedExpenses = [...expenses].sort((a, b) =>
        a.total < b.total ? -1 : 1
      );
      setascending(sortedExpenses);
    }
  };

  const filterExpensesByDay = (day: string) => {
    if (expenses && day !== "None") {
      const filtered = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date!);
        return (
          expenseDate.toLocaleDateString("en-US", { weekday: "long" }) === day
        );
      });
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expenses || []);
    }
  };

  useEffect(() => {
    if (category) {
      const { savedPercentage, spentPercentage } = calculatePercentages(
        category.budget,
        category.amount_left,
        category.amount_spent
      );
      setCategoryPercentages({
        savedPercentage,
        spentPercentage,
      });
    }
  }, [category]);

  useEffect(() => {
    filterExpensesByDay(selectedDay);
  }, [selectedDay, expenses]);

  const [{ savedPercentage, spentPercentage }, setCategoryPercentages] =
    useState<{
      savedPercentage: number;
      spentPercentage: number;
    }>({
      savedPercentage: 0,
      spentPercentage: 0,
    });

  if (!category || !expenses)
    return (
      <p className="flex h-full items-center justify-center">Please wait...</p>
    );

  return (
    <div
      className="relative flex min-h-full flex-col"
      style={{
        color: category.category_color,
      }}
    >
      <div className="flex flex-col bg-orange-50 px-16 py-16 md:flex-row md:justify-between md:px-32">
        <div className="mb-8 flex flex-grow-0 flex-col md:px-24">
          <h1
            className="mb-8 text-5xl font-bold md:text-8xl"
            style={{ wordBreak: "break-all" }}
          >
            {category.category_name}
          </h1>
          <div
            className="flex-start flex w-full self-start"
            style={{ wordBreak: "break-all" }}
          >
            <p>
              {category.description ? category.description : "No description."}
            </p>
          </div>
        </div>

        <div className="max-w-1/3 flex flex-col items-center md:mr-32">
          {/* budget */}
          <div
            className="mb-3 flex h-24 w-[27rem] flex-col rounded-lg p-4 text-center text-white drop-shadow-lg md:w-full"
            style={{
              backgroundColor: category.category_color,
            }}
          >
            <text>Budget</text>
            <text className="text-3xl font-bold md:text-5xl">
              ₱{category.budget}
            </text>
          </div>

          <div className="mb-4 flex flex-row gap-3 md:gap-4">
            {/* saved */}
            <div
              className="flex h-[12rem] w-[13rem] flex-col items-center rounded-lg bg-white px-4 py-8 text-center drop-shadow-lg md:h-[15rem] md:w-[15rem]"
              style={{ wordBreak: "break-all" }}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-emerald-100 md:h-20 md:w-20">
                <ArrowUp className="size-8" style={{ color: "#00994d" }} />
              </div>
              <text>Total Saved</text>
              <text
                className="overflow-hidden text-ellipsis text-2xl font-bold md:text-4xl"
                style={{ wordBreak: "break-all" }}
              >
                ₱{category.amount_left}
              </text>
            </div>

            {/* spent */}
            <div className="flex size-40 h-[12rem] w-[13rem] flex-col items-center rounded-lg bg-white px-4 py-8 text-center drop-shadow-lg md:h-[15rem] md:w-[15rem]">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-red-100 md:h-20 md:w-20">
                <ArrowDown className="size-8" style={{ color: "#ff4d4d" }} />
              </div>
              <text>Total Spent</text>
              <text
                className="overflow-hidden text-ellipsis text-2xl font-bold md:text-4xl"
                style={{ wordBreak: "break-all" }}
              >
                ₱{category.amount_spent}
              </text>
            </div>
          </div>

          {/* progress bar */}
          <div className="mb-4 flex h-12 w-[27rem] items-center rounded-full bg-gray-200 md:w-full">
            <div
              className="flex h-full items-center justify-center rounded-full"
              style={{
                width: `${savedPercentage}%`,
                backgroundColor:
                  savedPercentage < 30 ? "#990000" : category.category_color,
              }}
            >
              {savedPercentage >= 30 && (
                <p className="font-bold text-white">
                  {savedPercentage.toFixed(0)}% left
                </p>
              )}
            </div>
            {spentPercentage >= 70 && (
              <p className="ml-8 font-bold text-gray-700">
                {spentPercentage.toFixed(0)}% spent
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-4 px-10 py-10">
        <div className="flex flex-row">
          <div
            className="mx-2 items-center justify-center align-middle"
            onClick={() => {
              setsortHighLow(!sortHighLow);
              setsortLowHigh(false);
              descendingSorted();
            }}
          >
            <button
              className={
                sortHighLow === true
                  ? "bg-green border-green rounded-full border-2 text-white"
                  : "border-green rounded-full border-2 bg-none"
              }
            >
              Sort By: Descending Expense
            </button>
          </div>

          <div
            className="mx-2 items-center justify-center align-middle"
            onClick={() => {
              setsortLowHigh(!sortLowHigh);
              setsortHighLow(false);
              ascendingSorted();
            }}
          >
            <button
              className={
                sortLowHigh === true
                  ? "bg-green border-green rounded-full border-2 text-white"
                  : "border-green rounded-full border-2 bg-none"
              }
            >
              Sort By: Ascending Expense
            </button>
          </div>
          <Link to={"expense/add"}>
            <CiCirclePlus
              style={{
                fontSize: "3rem",
                color: category.category_color,
                // paddingRight: "1rem",
              }}
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <WeeklyFilterDropdown
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          {selectedDay}
        </div>

        <div className="flex w-full flex-col">
          {(sortHighLow || sortLowHigh
            ? sortHighLow
              ? descending
              : ascending
            : filteredExpenses
          )?.map((expense: Expense) => (
            <ExpenseBox
              date={expense.date}
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
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default CategoryPage;
