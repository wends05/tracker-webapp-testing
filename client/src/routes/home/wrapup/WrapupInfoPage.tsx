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
      ((wrapUpInfo!.total_budget / wrapUpInfo!.total_not_spent) * 100).toFixed(
        2
      )
    );
    setSpentPercentage(
      ((wrapUpInfo!.total_spent / wrapUpInfo!.total_budget) * 100).toFixed(2)
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
  return (
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
            <div className="h-[10rem] w-[30rem] bg-slate-700 text-white">
              insert ang expenses here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrapupInfoPage;
