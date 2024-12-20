import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { BackendResponse } from "@/interfaces/BackendResponse";
import { Category, User, WeeklySummary } from "@/utils/types";
import CategoryView from "@/components/CategoryView";
import { useQuery } from "@tanstack/react-query";
import getUser from "@/utils/getUser";
import { WeeklyChart } from "@/components/WeeklyChart";
import CategorySorter from "@/components/Sorter";

import emptyListIcon from "../../assets/empty_list_icon.png";

const Dashboard = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { data: weeklySummary } = useQuery({
    enabled: !!user,
    queryKey: ["weeklySummary"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/user/${user!.user_id}/recent`
      );

      if (!response.ok) {
        throw Error("Error Fetched");
      }

      const { data } =
        (await response.json()) as BackendResponse<WeeklySummary>;
      return data;
    },
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        throw Error("No user provided");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${user.user_id}/categories`
      );

      if (!response.ok) {
        throw Error("Error Fetched");
      }

      const { data } = (await response.json()) as BackendResponse<Category[]>;
      return data;
    },
  });

  const [sortedCategories, setSortedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categories) {
      setSortedCategories(categories); // Set initial sorted categories
    }
  }, [categories]);

  const handleSort = (sortedCategories: Category[]) => {
    setSortedCategories(sortedCategories);
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          Welcome, {user?.username} <span className="wave">👋</span>
        </h1>
      </header>
      <div className="pb-3">
        <h2>Dashboard</h2>
      </div>
      <div className="grid flex-auto grid-cols-1 gap-8 px-8 md:grid-cols-3">
        {/* Placeholder for Summary Graph */}
        <div className="shadow-none">
          <WeeklyChart weekly_summary_id={null} />
        </div>

        {/* Money Left */}
        <div className="relative col-span-1 flex flex-col justify-center rounded-lg bg-white p-8 shadow-md before:absolute before:inset-5 before:rounded-xl before:border before:border-gray-200 before:shadow-lg">
          <h2 className="mb-4 text-center text-xl font-medium text-emerald-400">
            Money Left
          </h2>
          <p className="line-clamp-2 flex flex-col text-center text-5xl font-bold text-emerald-400">
            {"₱ "}
            {weeklySummary?.total_not_spent
              ? new Intl.NumberFormat().format(weeklySummary.total_not_spent)
              : 0}
          </p>
        </div>

        {/* Budget and Expenses */}
        <div className="col-span-1 flex flex-col gap-8">
          {/* Current Budget */}
          <div className="relative justify-center rounded-lg bg-white p-10 shadow-xl before:absolute before:inset-5 before:rounded-lg before:border before:border-gray-200 before:shadow-lg">
            <h2 className="mb-2 text-center text-lg font-medium text-black">
              Current Budget
            </h2>
            <p className="line-clamp-2 flex flex-col text-center text-4xl font-bold text-black">
              {"₱ "}
              {weeklySummary?.total_budget
                ? new Intl.NumberFormat().format(weeklySummary.total_budget)
                : 0}
            </p>
          </div>

          {/* Total Expenses */}
          <div className="relative flex flex-col justify-center rounded-lg bg-white p-10 shadow-xl before:absolute before:inset-5 before:rounded-lg before:border before:border-gray-200 before:shadow-lg">
            <h2 className="mb-2 text-center text-lg font-medium text-red-500">
              Total Expenses
            </h2>
            <p className="line-clamp-2 flex flex-col text-center text-4xl font-bold text-red-500">
              {"₱ "}
              {weeklySummary?.total_spent
                ? new Intl.NumberFormat().format(weeklySummary.total_spent)
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-black">Categories</h2>
        {isLoading ? (
          <div className="relative flex h-full w-full flex-row justify-between gap-14 rounded-lg p-4"></div>
        ) : !categories || categories.length === 0 ? (
          <div className="mx-auto my-4 flex flex-col items-center justify-center">
            <img
              src={emptyListIcon}
              alt="Empty List"
              className="h-48 w-48 object-contain opacity-50"
            />
            <h4 className="text-slate-600">No categories added</h4>
            <Link
              className="bg-green mt-4 flex h-16 w-64 items-center justify-center rounded-lg text-white shadow-lg hover:rounded-lg hover:border hover:border-white hover:bg-teal-950 hover:text-white"
              to="category/add"
            >
              <span className="text-lg font-medium">Add new category</span>
            </Link>
          </div>
        ) : (
          <>
            <CategorySorter onSort={handleSort} categories={categories} />
            <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
              {/* Add New Category */}
              <Link
                className="mx-5 my-5 flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-500 shadow-lg hover:bg-gray-200"
                to="category/add"
              >
                <span className="text-4xl">+</span>
              </Link>

              {sortedCategories?.map((category) => (
                <CategoryView category={category} key={category.category_id} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default Dashboard;
