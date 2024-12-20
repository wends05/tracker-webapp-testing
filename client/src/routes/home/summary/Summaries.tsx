import WeeklySummaryCard from "@/components/SummaryCard";
import getUser from "@/utils/getUser";
import { User, WeeklySummary } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import emptyListIcon from "./../../../assets/empty_list_icon.png";

const WeeklySummaryPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const { data: summaries, isLoading } = useQuery<WeeklySummary[]>({
    queryKey: ["summaries"],
    enabled: !!user,
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/user/${user?.user_id}`
      );
      if (!response.ok) {
        const errorMessage = await response.json();
        throw Error(errorMessage);
      }
      const { data } = await response.json();
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
          <l-bouncy size="77" speed="1.75" color="black"></l-bouncy>
        </div>
      )}

      <header className="mb-10 ml-16">
        <h1 className="text-3xl font-bold">Weekly Summaries</h1>
      </header>
      {summaries && summaries.length > 1 ? (
        summaries
          ?.slice(1)
          .map((summary, index) => (
            <WeeklySummaryCard key={index} summary={summary} />
          ))
      ) : (
        <div className="mx-auto my-4 flex flex-col items-center justify-center">
          <img
            src={emptyListIcon}
            alt="Empty List"
            className="h-48 w-48 object-contain opacity-50"
          />
          <h4 className="text-slate-600">Nothing to see here</h4>
        </div>
      )}
    </div>
  );
};

export default WeeklySummaryPage;
