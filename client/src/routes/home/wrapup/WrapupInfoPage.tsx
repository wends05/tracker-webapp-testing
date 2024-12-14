import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BackendResponse } from "@/interfaces/BackendResponse";
import getUser from "@/utils/getUser";
import { User, WeeklySummary, Expense } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WrapupInfoPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const [spentPercentage, setSpentPercentage] = useState<number>(0);
  const [savedPercentage, setSavePercentage] = useState<number>(0);
  const [topExpenses, setTopExpenses] = useState<Expense[]>([]);

  const { data: wrapUpInfo, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["wrapUpInfo"],
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

  useEffect(() => {
    if (wrapUpInfo) {
      setSavePercentage(
        Math.round((wrapUpInfo.total_not_spent / wrapUpInfo.total_budget) * 100)
      );
      setSpentPercentage(
        Math.round((wrapUpInfo.total_spent / wrapUpInfo.total_budget) * 100)
      );

      //array checking wrapupinfio exists
      if (Array.isArray(wrapUpInfo.expenses)) {
        const sortedExpenses = wrapUpInfo.expenses
          .sort((a, b) => b.total - a.total) //soorting by order 
          .slice(0, 5); //  top 5 expenses
        setTopExpenses(sortedExpenses);
      } else {
        setTopExpenses([]); // empty if no expenses are fetched
      }
    }
  }, [wrapUpInfo]);

  return isLoading ? (
    <>loading page</>
  ) : (
    <div className="overflow-hidden">
      <div className="ml-5 mt-3 text-4xl font-bold">Week-End Review</div>
      <hr className="ml-6 mr-6 mt-3 border-t-2 border-slate-950" />
      <div className="ml-8 mt-3 flex gap-80">
        <div>
          <h4 className="text-lg font-medium">Summary of Expenses</h4>
          <div className="h-[15rem] w-[30rem] bg-slate-700 text-white">
            insert ang graph here
          </div>
          <div className="ml-2 mt-3">
            <h4 className="text-lg font-medium">
              From a total budget of {wrapUpInfo?.total_budget} this week
            </h4>

            <div className="mt-7 flex gap-12 font-semibold">
              <div>
                <h3 className="font-semibold">You saved</h3>
                <br />
                <h4 className="text-lime-600">{wrapUpInfo?.total_not_spent}</h4>
                <br />
                <h4>{savedPercentage}% of your budget</h4>
              </div>

              <div>
                <h3 className="font-semibold">You spent</h3>
                <br />
                <h4 className="text-red-700">{wrapUpInfo?.total_spent}</h4>
                <br />
                <h4>{spentPercentage}% of your budget</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 text-lg font-medium">
            Your most spent categories
          </h4>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-lg overflow-visible"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-36">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="mt-6">
            <h4 className="mb-4 text-lg font-medium">Your highest expenses</h4>
            {topExpenses.length > 0 ? (
              <div className="flex flex-col gap-4">
                {topExpenses.map((expense) => ( //maps to see top expenses exists
                  <Card
                    key={expense.expense_id || expense.expense_name}// shows wither expense ID or message that no expenses exists
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <h5 className="text-lg font-semibold">
                        {expense.expense_name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {expense.price} × {expense.quantity}
                      </p>
                    </div>
                    <h5 className="text-xl font-bold">{expense.total}</h5>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No expenses found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrapupInfoPage;
