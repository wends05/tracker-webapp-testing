import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DrawerDemo } from "@/components/ui/DrawerDemo";
import { WeeklyChart } from "@/components/WeeklyChart";
import { BackendResponse } from "@/interfaces/BackendResponse";
import getUser from "@/utils/getUser";
import { User, WeeklySummary, Expense, Category } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WrapupInfoPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const queryClient = useQueryClient();

  const [spentPercentage, setSpentPercentage] = useState<number>(0);
  const [savedPercentage, setSavePercentage] = useState<number>(0);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: wrapUpInfo, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["weeklySummary"],
    queryFn: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "category",
      });
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

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    enabled: !!user,
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${user!.user_id}/categories`
      );

      if (!response.ok) {
        throw Error("Error Fetched");
      }

      const { data } = (await response.json()) as BackendResponse<Category[]>;
      return data;
    },
  });

  const topSpentCategories = categories
    ?.sort((a, b) => b.amount_spent - a.amount_spent)
    .slice(0, 5);

  const { data: highestExpenses } = useQuery({
    enabled: !!user,
    queryKey: ["highestExpenses"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/expense/user/${user?.user_id}/highest-expenses`
      );

      if (!response.ok) {
        throw Error("Error Fetching Top Expenses");
      }

      const { data } = (await response.json()) as BackendResponse<Expense[]>;
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
    }
  }, [wrapUpInfo]);

  return isLoading ? (
    <>loading page</>
  ) : (
    <div className="overflow-hidden">
      <div className="ml-4 mt-2 text-3xl font-semibold">Week-End Review</div>
      <hr className="ml-4 mr-4 mt-2 border-t border-slate-950" />
      <div className="ml-6 mt-2 flex flex-col gap-8 sm:flex-row sm:gap-16">
        {/* Summary Section */}
        <div className="flex flex-1 flex-col">
          <div>
            <h4 className="text-lg font-medium sm:text-xl lg:text-2xl">
              Summary of Expenses
            </h4>
            <div className="mx-auto ml-0 mt-5 h-[20rem] w-[30rem]">
              {" "}
              {wrapUpInfo?.weekly_summary_id && (
                <WeeklyChart
                  weekly_summary_id={wrapUpInfo?.weekly_summary_id}
                  isRecent={true}
                />
              )}
            </div>
          </div>

          <div className="ml-2 mt-14">
            <h4 className="text-l sm:text-s font-medium lg:text-2xl">
              From a total budget of{" "}
              <span className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
                {wrapUpInfo?.total_budget}
              </span>{" "}
              this week
            </h4>

            <div className="mt-4 flex flex-col gap-4 text-lg font-semibold sm:flex-row sm:gap-12 sm:text-xl lg:text-2xl">
              <div className="flex flex-col items-start">
                <h3 className="text-l font-semibold sm:text-xl lg:text-2xl">
                  You saved
                </h3>
                <h4 className="pt-2 text-xl text-lime-600 sm:text-2xl lg:text-3xl">
                  {wrapUpInfo?.total_not_spent}
                </h4>
                <h4 className="text-lg sm:text-xl lg:text-2xl">
                  {savedPercentage}% of your budget
                </h4>
              </div>

              <div className="items-left flex flex-col">
                <h3 className="text-l font-semibold sm:text-xl lg:text-2xl">
                  You spent
                </h3>
                <h4 className="pt-2 text-xl text-red-700 sm:text-2xl lg:text-3xl">
                  {wrapUpInfo?.total_spent}
                </h4>
                <h4 className="text-m sm:text-sm lg:text-xl">
                  {spentPercentage}% of your budget
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Most Spent Categories Section */}
        <div className="mt-3 flex flex-col sm:flex-1">
          <h4 className="mb-4 text-xl font-medium sm:text-2xl">
            Your most spent categories
          </h4>
          <Carousel className="relative w-full max-w-full sm:max-w-2xl lg:max-w-4xl">
            <CarouselContent>
              {topSpentCategories?.map((category) => (
                <CarouselItem
                  key={category.category_id}
                  className="flex items-center justify-center"
                  style={{
                    height: "15rem",
                    width: "100%",
                  }}
                >
                  <Card className="h-full w-full max-w-[95%] rounded-full shadow-md sm:max-w-[80%] lg:max-w-[60%]">
                    <CardContent
                      className="flex h-full flex-col items-center justify-center p-4 sm:p-6"
                      style={{ backgroundColor: category.category_color }}
                    >
                      <h3 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                        {category.category_name}
                      </h3>
                      <h6 className="mt-2 text-lg font-bold text-white sm:text-xl lg:text-2xl">
                        Spent: PHP {category.amount_spent}
                      </h6>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-10 top-1/2 z-10 -translate-y-1/2" />
            <CarouselNext className="absolute right-16 top-1/2 z-10 -translate-y-1/2" />
          </Carousel>

          {/* Highest Expenses Section */}
          <div className="mt-4">
            <h4 className="mb-4 text-xl font-medium sm:text-2xl">
              Your highest expenses
            </h4>
            <div className="relative mb-3 h-[14rem] w-[30rem] overflow-y-auto rounded-lg border border-gray-200 p-4 shadow-sm sm:w-[35rem] lg:w-[40rem]">
              {highestExpenses && highestExpenses.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {highestExpenses.map((expense) => (
                    <Card
                      key={expense.expense_id || expense.expense_name}
                      className="flex items-center justify-between p-2"
                    >
                      <div>
                        <h5 className="text-base font-semibold sm:text-lg">
                          {expense.expense_name}
                        </h5>
                        <p className="text-sm text-gray-500 sm:text-base">
                          {expense.price} × {expense.quantity}
                        </p>
                      </div>
                      <h5 className="text-lg font-bold sm:text-xl">
                        {expense.total}
                      </h5>
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

      <button
        className="bg-green fixed bottom-8 right-8 z-50 w-full rounded px-4 py-2 text-lg text-white hover:bg-teal-700 sm:w-auto"
        onClick={() => setIsDrawerOpen(true)}
      >
        Next
      </button>

      <div className="fixed bottom-4 left-4">
        <DrawerDemo open={isDrawerOpen} setOpen={setIsDrawerOpen} />
      </div>
    </div>
  );
};

export default WrapupInfoPage;
