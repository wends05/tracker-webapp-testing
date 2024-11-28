import { BackendResponse } from "@/interfaces/BackendResponse";
import { Category } from "@/utils/types";
import { Outlet, useLoaderData } from "react-router-dom";

const CategoryPage = () => {
  const { data: category } = useLoaderData() as BackendResponse<Category>;

  const calculatePercentages = (
    budget: number,
    amountSaved: number,
    amountSpent: number
  ) => {
    if (budget === 0) {
      return { savedPercentage: 0, spentPercentage: 0 };
    }
    const savedPercentage = (amountSaved / budget) * 100;
    const spentPercentage = (amountSpent / budget) * 100;
    return { savedPercentage, spentPercentage };
  };

  const { savedPercentage, spentPercentage } = calculatePercentages(
    category.budget,
    category.amount_left,
    category.amount_spent
  );

  return (
    <div className={`relative mt-12 flex h-full justify-center px-16`}>
      <div className="flex h-96 w-1/3 flex-col items-center">
        <h1 className="mb-8 text-2xl text-6xl font-bold text-black">
          {category.category_name}
        </h1>
        <div className="mb-8 min-h-56 w-96 rounded-3xl bg-white drop-shadow-lg">
          <div
            className="mb-4 flex h-12 w-full items-center rounded-t-2xl px-6 font-bold text-white"
            style={{
              backgroundColor: category.category_color,
            }}
          >
            <text>Description</text>
          </div>
          <text className="ml-6">{category.description}</text>
        </div>
      </div>

      <div className="flex h-96 w-1/3 flex-col items-center">
        <div
          className="mb-8 mt-20 h-16 w-96 rounded-3xl bg-white p-4 text-center text-white drop-shadow-lg"
          style={{
            backgroundColor: category.category_color,
          }}
        >
          <text>Total Budget: </text>
          <text className="text-2xl font-bold">₱{category.budget}</text>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex size-52 flex-col items-center py-8 text-center">
            <text>Total Saved</text>
            <text className="text-6xl font-bold">
              {savedPercentage.toFixed(0)}%
            </text>
            <text className="font-bold">₱{category.amount_left}</text>
          </div>
          <div className="flex size-52 flex-col items-center py-8 text-center">
            <text>Total Spent</text>
            <text className="text-6xl font-bold">
              {spentPercentage.toFixed(0)}%
            </text>
            <text className="font-bold">₱{category.amount_spent}</text>
          </div>
        </div>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default CategoryPage;
