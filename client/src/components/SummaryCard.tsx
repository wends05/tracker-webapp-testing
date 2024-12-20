import { BackendResponse } from "@/interfaces/BackendResponse";
import { SavedCategories, WeeklySummary } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CategoryGraph } from "./PieChart";
import { BackendError } from "@/interfaces/ErrorResponse";

const WeeklySummaryCard = ({ summary }: { summary: WeeklySummary }) => {
  const { data: weeklySummaryCategories } = useQuery({
    queryKey: ["weeklySummary", summary.weekly_summary_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/${summary.weekly_summary_id}/savedcategories`
      );

      if (!response.ok) {
        const { message: errorMessage } =
          (await response.json()) as BackendError;
        throw Error(errorMessage);
      }

      const { data } = (await response.json()) as BackendResponse<
        SavedCategories[]
      >;
      return data;
    },
  });
  const startDate = new Date(summary.date_start);
  const endDate = new Date(summary.date_end);

  console.log(startDate);
  console.log(endDate);

  return (
    <Link to={`/weeklysummary/${summary.weekly_summary_id}`}>
      <div className="border-green hover:bg-green group relative mb-10 flex flex-col items-center rounded-xl border-2 bg-none p-4 transition-transform duration-300 ease-in-out hover:translate-y-[-5px] hover:text-white hover:shadow-xl sm:mx-4 md:mx-4 md:flex-row md:p-6 lg:mx-20">
        {/* Chart Container */}
        <div className="duration-30 mb-4 max-h-full w-full transition-colors md:mb-0 md:w-1/3 md:pl-10">
          {weeklySummaryCategories && (
            <CategoryGraph categories={weeklySummaryCategories} />
          )}
        </div>

        {/* Start and End Date */}
        <div className="mb-4 w-full text-center font-bold md:absolute md:left-[35%] md:top-[10%] md:mb-0 md:w-2/3 md:text-left">
          <p className="text-green text-xl transition-colors duration-300 group-hover:text-white md:text-3xl">
            {startDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -{" "}
            {endDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Total Budget */}
        <div className="w-full text-center md:absolute md:bottom-6 md:left-[35%] md:w-auto md:text-left">
          <p className="text-sm text-black transition-colors duration-300 group-hover:text-white md:text-lg">
            <span className="font-semibold">Total Budget: </span>$
            {summary.total_budget}
          </p>
        </div>

        {/* Saved Amount */}
        <div className="w-full text-center md:absolute md:bottom-6 md:right-6 md:w-auto md:text-right">
          <p className="text-sm transition-colors duration-300 group-hover:text-white">
            Saved:
          </p>
          <p className="text-lg font-bold transition-colors duration-300 group-hover:text-white md:text-2xl">
            ${summary.total_not_spent}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default WeeklySummaryCard;
