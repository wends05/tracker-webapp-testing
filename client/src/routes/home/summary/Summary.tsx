import { CategoryGraph } from "@/components/PieChart";
import { BackendResponse } from "@/interfaces/BackendResponse";
import getUser from "@/utils/getUser";
import { SavedCategories, User } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Summary = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const { weeklysummary_id } = useParams();
  const { data: weeklySummaryCategories } = useQuery({
    queryKey: ["weeklySummary", weeklysummary_id],
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

  return (
    <div>
      {weeklySummaryCategories ? (
        <CategoryGraph categories={weeklySummaryCategories} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Summary;
