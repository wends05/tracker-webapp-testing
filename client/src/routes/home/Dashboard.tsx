import { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { BackendResponse } from "@/interfaces/BackendResponse";
import { Category } from "@/utils/types";
import CategoryView from "@/components/CategoryView";

const Dashboard = () => {
  const { data: categories } = useLoaderData() as BackendResponse<Category[]>;
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalNotSpent, settotalNotSpent] = useState(0);
  useEffect(() => {
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
  }, [categories]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          Welcome, Xai <span className="wave">👋</span>
        </h1>
      </header>
      {/* Summary Part */}
      <div className="grid grid-cols-4 gap-6">
        {/* Placeholder for Summary Graph */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-black">Summary</h2>
          <div className="flex items-center justify-around">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-3 rounded bg-teal-400"
                  style={{ height: `${(index + 1) * 20}px` }}
                />
                <p className="mt-1 text-xs">Day {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Money Left */}
        <div className="flex flex-col justify-center rounded-lg bg-white p-6 shadow">
          <h2 className="mb-2 text-center text-lg font-medium text-black">
            Money Left
          </h2>
          <p className="text-center text-4xl font-bold text-black">
            {totalNotSpent}
          </p>
        </div>

        {/* Budget and Expenses */}
        <div className="space-y-6">
          <div className="flex flex-col justify-center rounded-lg bg-white p-6 shadow">
            <h2 className="mb-2 text-center text-sm font-medium text-black">
              {" "}
              Current Budget
            </h2>
            <p className="text-center text-3xl font-bold text-black">
              {totalBudget}
            </p>
          </div>

          {/* Total Expenses */}
          <div className="flex flex-col justify-center rounded-lg bg-white p-6 shadow">
            <h2 className="mb-2 text-center text-sm font-medium text-black">
              Total Expenses
            </h2>
            <p className="text-center text-3xl font-bold text-black">
              {totalSpent}
            </p>
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-black">Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {/* Add New Category */}
          {/* <button
            onClick={() => {}}
            className="flex h-32 items-center justify-center rounded-lg bg-gray-100 text-gray-500 shadow hover:bg-gray-200" 
          >

          </button> */}
          <Link
            className="flex h-32 items-center justify-center rounded-lg bg-gray-100 text-gray-500 shadow hover:bg-gray-200"
            to="category/add"
          >
            <span className="text-4xl">+</span>
          </Link>

          {/* Render Existing Categories */}
          {categories.map((category) => (
            <CategoryView category={category} key={category.category_id} />
          ))}
        </div>
      </div>{" "}
      <Outlet />
    </div>
  );
};

export default Dashboard;
