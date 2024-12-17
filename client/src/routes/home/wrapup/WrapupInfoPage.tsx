import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DrawerDemo } from "@/components/ui/DrawerDemo";
import { BackendResponse } from "@/interfaces/BackendResponse";
import getUser from "@/utils/getUser";
import { Category, User, WeeklySummary } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WrapupInfoPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const [spentPercentage, setSpentPercentage] = useState(0);
  const [savedPercentage, setSavePercentage] = useState(0);

  const { data: wrapUpInfo, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["weeklySummary"],
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const topSpentCategories = categories
    ?.sort((a, b) => b.amount_spent - a.amount_spent)
    .slice(0, 5);

  if (isLoading) return <div>Loading page...</div>;

  const startDate = new Date(wrapUpInfo!.date_start);
  const startShortDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(startDate);

  const endDate = new Date(wrapUpInfo!.date_end);
  const endShortDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(endDate);

  return (
    <div className="relative h-screen overflow-auto p-4">
      <div className="mt-3 flex flex-col items-center justify-between gap-4 px-5 font-bold md:flex-row md:text-4xl">
        <div className="text-2xl md:text-4xl">Week-End Review</div>
        <div className="text-lg font-normal md:text-2xl">
          {startShortDate} - {endShortDate}
        </div>
      </div>
      <hr className="my-4 border-t-2 border-slate-950" />

      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        {/* Summary of Expenses */}
        <div className="w-full md:w-1/2">
          <h4 className="text-lg font-medium">Summary of Expenses</h4>
          <div className="flex h-[15rem] w-full items-center justify-center bg-slate-700 text-white">
            insert ang graph here
          </div>

          <div className="pt-4">
            <h4 className="text-lg font-medium">
              From a total budget of {wrapUpInfo?.total_budget} this week
            </h4>

            <div className="flex flex-col gap-6 pt-4 font-semibold md:flex-row md:gap-12">
              <div>
                <h3 className="font-semibold">You saved</h3>
                <h4 className="pt-2 text-lime-600">
                  {wrapUpInfo?.total_not_spent}
                </h4>
                <h4>{savedPercentage}% of your budget</h4>
              </div>

              <div>
                <h3 className="font-semibold">You spent</h3>
                <h4 className="pt-2 text-red-700">{wrapUpInfo?.total_spent}</h4>
                <h4>{spentPercentage}% of your budget</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Top Spent Categories */}
        <div className="w-full md:w-1/2">
          <h4 className="pb-4 text-lg font-medium">
            Your most spent categories
          </h4>

          <Carousel className="relative w-full">
            <CarouselContent>
              {topSpentCategories?.map((category) => (
                <CarouselItem
                  key={category.category_id}
                  className="flex items-center justify-center"
                >
                  <Card className="w-full max-w-[300px] rounded-xl shadow-lg">
                    <CardContent
                      className="flex flex-col items-center justify-center p-6"
                      style={{ backgroundColor: category.category_color }}
                    >
                      <h3 className="text-2xl font-bold text-white">
                        {category.category_name}
                      </h3>
                      <h6 className="font-bold text-white">
                        Spent: PHP {category.amount_spent}
                      </h6>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-[-1rem] top-1/2 z-10 -translate-y-1/2" />
            <CarouselNext className="absolute right-[-1rem] top-1/2 z-10 -translate-y-1/2" />
          </Carousel>

          <div className="pt-6">
            <h4 className="pb-4 text-lg font-medium">Your highest expenses</h4>
            <div className="flex h-[10rem] w-full items-center justify-center bg-slate-700 text-white">
              insert ang expenses here
            </div>
          </div>
        </div>
      </div>

      <button
        className="bg-green fixed bottom-20 right-8 rounded px-4 py-2 text-white hover:bg-teal-700"
        onClick={() => setIsDrawerOpen(true)}
      >
        Next
      </button>

      <div className="fixed bottom-6 left-6">
        <DrawerDemo open={isDrawerOpen} setOpen={setIsDrawerOpen} />
      </div>
    </div>
  );
};

export default WrapupInfoPage;
