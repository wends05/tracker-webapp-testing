import WeeklySummaryCard from "@/components/SummaryCard";
import getUser from "@/utils/getUser";
import { User, WeeklySummary } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

const WeeklySummaryPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const { data: summaries } = useQuery<WeeklySummary[]>({
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
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Weekly Summaries</h1>
      </header>
      <div className="space-y-6">
        {summaries &&
          summaries.map((summary, index) => (
            <WeeklySummaryCard key={index} summary={summary} />
          ))}
      </div>
    </div>
  );
};

export default WeeklySummaryPage;
