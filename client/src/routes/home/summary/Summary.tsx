import { CategoryGraph } from "@/components/PieChart";
import SavedCategoryCard from "@/components/SaveCategoryCard";
import { BackendResponse } from "@/interfaces/BackendResponse";
import getUser from "@/utils/getUser";
import { SavedCategories, User } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Outlet, useParams } from "react-router-dom";
import { useState } from "react";

const Summary = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const { weeklysummary_id } = useParams();

  const { data: weeklySummaryCategories } = useQuery({
    queryKey: ["weeklySummary", weeklysummary_id, "categories"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/${weeklysummary_id}/savedcategories`
      );

      if (!response.ok) {
        const { message: errorMessage } = (await response.json()) as {
          message: string;
        };
        throw Error(errorMessage);
      }

      const { data } = (await response.json()) as BackendResponse<
        SavedCategories[]
      >;
      return data;
    },
    enabled: !!user,
  });

  const [sortHighLow, setSortHighLow] = useState(false);
  const [sortLowHigh, setSortLowHigh] = useState(false);
  const [sortedCategories, setSortedCategories] = useState<SavedCategories[] | null>(null);


  const ascendingSorted = () => {
    if (!weeklySummaryCategories) return;
    const sorted = [...weeklySummaryCategories].sort(
      (a, b) => a.amount_spent - b.amount_spent
    );
    setSortedCategories(sorted);
  };

  const descendingSorted = () => {
    if (!weeklySummaryCategories) return;
    const sorted = [...weeklySummaryCategories].sort(
      (a, b) => b.amount_spent - a.amount_spent
    );
    setSortedCategories(sorted);
  };

  return (
    <div className="pl-5 pr-5 pt-5">
      <h1 className="pb-2 font-bold">*Insert Date*</h1>
      <hr className="border-t-2 border-slate-900 pl-2 pr-2 pt-2" />
      <div>
        {/* Graphs */}
        <div className="mt-6 flex gap-20">
          {weeklySummaryCategories ? (
            <div>
              <CategoryGraph categories={weeklySummaryCategories} />
            </div>
          ) : (
            <div>Loading...</div>
          )}

          <div className="w-80">
            <WeeklyChart week={null} />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-4">
        <h4 className="text-lg font-medium">Categories</h4>

        {/* Sorting Buttons */}
        <div className="my-4 flex gap-4">
          <button
            className={`rounded-full border-2 px-4 py-2 text-sm ${
              sortHighLow ? "bg-green text-white" : "bg-white text-green"
            }`}
            onClick={() => {
              setSortHighLow(!sortHighLow);
              setSortLowHigh(false);
              descendingSorted();
            }}
          >
            Sort by: Descending Expense
          </button>

          <button
            className={`rounded-full border-2 px-4 py-2 text-sm ${
              sortLowHigh ? "bg-green text-white" : "bg-white text-green"
            }`}
            onClick={() => {
              setSortLowHigh(!sortLowHigh);
              setSortHighLow(false);
              ascendingSorted();
            }}
          >
            Sort by: Ascending Expense
          </button>
        </div>

        <div>Insert Categories</div>
        <div className="grid md:grid-cols-3">
          {(sortHighLow || sortLowHigh
            ? sortedCategories
            : weeklySummaryCategories
          )?.map((weeklyCategory) => (
            <SavedCategoryCard
              category={weeklyCategory}
              key={weeklyCategory.weekly_summary_id}
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

export default Summary;
