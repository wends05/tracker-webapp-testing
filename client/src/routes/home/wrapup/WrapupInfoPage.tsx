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
import { User, WeeklySummary } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WrapupInfoPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const [spentPercentage, setSpentPercentage] = useState(0);
  const [savedPercetage, setSavePercentage] = useState(0);

  useEffect(() => {
    setSavePercentage(
      Math.round((wrapUpInfo!.total_budget / wrapUpInfo!.total_not_spent) * 100)
    );
    setSpentPercentage(
      Math.round((wrapUpInfo!.total_spent / wrapUpInfo!.total_budget) * 100)
    );
  });

  const { data: wrapUpInfo } = useQuery({
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
      console.log(data);
      return data;
    },
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="pl-5 pt-3 text-4xl font-bold">Week-End Review</div>
      <hr className="border-t-2 border-slate-950 pl-6 pr-6 pt-3" />
      <div className="flex gap-80 pl-8 pt-3">
        <div>
          <h4 className="text-lg font-medium">Summary of Expenses</h4>
          <div className="h-[15rem] w-[30rem] bg-slate-700 text-white">
            insert ang graph here
          </div>
          <div className="pl-2 pt-3">
            <h4 className="text-lg font-medium">
              From a total budget of {wrapUpInfo?.total_budget} this week
            </h4>

            <div className="flex gap-12 pt-7 font-semibold">
              <div>
                <h3 className="font-semibold">You saved</h3>
                <br></br>
                <h4 className="text-lime-600">{wrapUpInfo?.total_not_spent}</h4>
                <br></br>
                <h4>{savedPercetage}% of your budget</h4>
              </div>

              <div>
                <h3 className="font-semibold">You spent</h3>
                <br></br>
                <h4 className="text-red-700">{wrapUpInfo?.total_spent}</h4>
                <br></br>
                <h4>{spentPercentage}% of your budget</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h4 className="pb-4 text-lg font-medium">
            Your most spent categories
          </h4>
          <Carousel
            opts={{ align: "start" }}
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

          <div className="pt-6">
            <h4 className="pb-4 text-lg font-medium">Your highest expenses</h4>
            <div className="h-[10rem] w-[30rem] bg-slate-700 text-white">
              insert ang expenses here
            </div>
          </div>
        </div>
      </div>

      <button
        className="bg-green absolute bottom-10 right-44 rounded px-4 py-2 text-white hover:bg-teal-700"
        onClick={() => setIsDrawerOpen(true)}
      >
        Next
      </button>

      <div className="absolute bottom-6 left-6">
        <DrawerDemo open={isDrawerOpen} setOpen={setIsDrawerOpen} />
      </div>
    </div>
  );
};

export default WrapupInfoPage;
