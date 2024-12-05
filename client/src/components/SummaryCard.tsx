import { WeeklySummary } from "@/utils/types";

const WeeklySummaryCard = ({ summary }: { summary: WeeklySummary }) => (
  <div className="bg-green flex items-center justify-between rounded-lg p-6 shadow-md">
    {/* chart here */}
    <div></div>

    {/* Start and End date, total budget */}
    <div className="ml-4 flex flex-col">
      <p className="text-sm text-gray-600">
        {summary.date_start.toString()}-{summary.date_end.toString()}
      </p>
      <p className="mt-2 text-sm">
        <span className="font-semibold">Total Budget: </span>${" "}
        {summary.total_budget}
      </p>
    </div>

    {/* Saved Amount */}
    <div className="ml-auto text-right">
      <p className="text-sm text-gray-600">Saved:</p>
      <p className="text-lg font-bold">${summary.total_not_spent}</p>
    </div>
  </div>
);

export default WeeklySummaryCard;
