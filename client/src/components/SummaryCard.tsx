import { WeeklySummary } from "@/utils/types";
import { Link } from "react-router-dom";

const WeeklySummaryCard = ({ summary }: { summary: WeeklySummary }) => {
  const startDate = new Date(summary.date_start);
  const endDate = new Date(summary.date_end);

  console.log(startDate);
  console.log(endDate);

  return (
    <Link to={`/weeklysummary/${summary.weekly_summary_id}`}>
      <div className="border-green hover:bg-green group relative ml-14 mr-14 flex items-center rounded-xl border-2 bg-none p-6 transition-transform duration-300 ease-in-out hover:translate-y-[-5px] hover:text-white hover:shadow-xl">
        {/* Chart Container */}
        <div className="bg-green h-72 w-1/3 transition-colors duration-300 group-hover:bg-white"></div>
        {/* Start and End Date */}
        <div className="absolute left-[35%] top-[10%] font-bold">
          <p className="text-green text-3xl transition-colors duration-300 group-hover:text-white">
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
        <div className="absolute bottom-6 left-[35%]">
          <p className="text-lg text-black transition-colors duration-300 group-hover:text-white">
            <span className="font-semibold">Total Budget: </span>$
            {summary.total_budget}
          </p>
        </div>

        {/* Saved Amount */}
        <div className="absolute bottom-6 right-6">
          <p className="text-sm transition-colors duration-300 group-hover:text-white">
            Saved:
          </p>
          <p className="text-2xl font-bold transition-colors duration-300 group-hover:text-white">
            ${summary.total_not_spent}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default WeeklySummaryCard;
