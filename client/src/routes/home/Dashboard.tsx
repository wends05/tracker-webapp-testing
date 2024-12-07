import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { BackendResponse } from "@/interfaces/BackendResponse";
import { Category } from "@/utils/types";
import CategoryView from "@/components/CategoryView";
import { useQuery } from "@tanstack/react-query";
import getUser from "@/utils/getUser";
import { WeeklyChart } from "@/components/WeeklyChart";

const Dashboard = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!user) {
        throw Error("No user provided");
      }
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${user.user_id!}/categories`
      );

      if (!response.ok) {
        throw Error("Error Fetched");
      }

      const { data } = (await response.json()) as BackendResponse<Category[]>;
      console.log(data);
      return data;
    },
  });

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalNotSpent, settotalNotSpent] = useState(0);
  useEffect(() => {
    if (categories) {
      console.log(categories);
      setTotalBudget(() => {
        return categories.reduce((acc, cat) => acc + cat.budget, 0);
      });
      setTotalSpent(() => {
        return categories.reduce(
          (acc, category) => acc + category.amount_spent,
          0
        );
      });
      settotalNotSpent(() => {
        return categories.reduce(
          (acc, category) => acc + category.amount_left,
          0
        );
      });
    }
  }, [categories]);

  return !categories ? (
    <div className="min-h-full">
      <h1 className="">Please wait</h1>{" "}
    </div>
  ) : (
    <div className="min-h-full bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          Welcome, {user?.username} <span className="wave">👋</span>
        </h1>
      </header>
      <div className="grid grid-cols-1 gap-8 px-8 md:grid-cols-3">
        {/* Placeholder for Summary Graph */}
        <div className="shadow-none">
          <WeeklyChart />
        </div>

        {/* Money Left */}
        <div className="relative col-span-1 flex flex-col justify-center rounded-lg bg-white p-8 shadow-md before:absolute before:inset-5 before:rounded-xl before:border before:border-gray-200 before:shadow-lg">
          <h2 className="mb-4 text-center text-xl font-medium text-black">
            Money Left
          </h2>
          <p className="text-center text-5xl font-bold text-black">
            {totalNotSpent}
          </p>
        </div>

        {/* Budget and Expenses */}
        <div className="col-span-1 flex flex-col gap-8">
          {/* Current Budget */}
          <div className="relative flex flex-col justify-center rounded-lg bg-white p-6 shadow-xl before:absolute before:inset-5 before:rounded-lg before:border before:border-gray-200 before:shadow-lg">
            <h2 className="mb-2 text-center text-lg font-medium text-black">
              Current Budget
            </h2>
            <p className="text-center text-4xl font-bold text-black">
              {totalBudget}
            </p>
          </div>

          {/* Total Expenses */}
          <div className="relative flex flex-col justify-center rounded-lg bg-white p-6 shadow-xl before:absolute before:inset-5 before:rounded-lg before:border before:border-gray-200 before:shadow-lg">
            <h2 className="mb-2 text-center text-lg font-medium text-black">
              Total Expenses
            </h2>
            <p className="text-center text-4xl font-bold text-black">
              {totalSpent}
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-black">Categories</h2>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {/* Add New Category */}
          <Link
            className="mx-5 my-5 flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-500 shadow-lg hover:bg-gray-200"
            to="category/add"
          >
            <span className="text-4xl">+</span>
          </Link>

          {/* Render Existing Categories */}
          {categories?.map((category) => (
            <CategoryView category={category} key={category.category_id} />
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
