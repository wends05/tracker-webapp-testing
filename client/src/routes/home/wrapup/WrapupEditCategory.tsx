import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category, User } from "@/utils/types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getUser from "@/utils/getUser";
import { toast } from "@/hooks/use-toast";

const WrapupEditCategory = () => {
  const categories = useLoaderData() as Category[];
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const [budgets, setBudgets] = useState(
    categories.reduce(
      (acc, category) => {
        acc[category.category_id!] = category.budget;
        return acc;
      },
      {} as Record<number, number>
    )
  );

  const handleBudgetChange = (id: number, newBudget: number) => {
    setBudgets((prev) => ({
      ...prev,
      [id]: newBudget,
    }));
  };

  const { mutate } = useMutation({
    mutationFn: async () => {
      const changedBudgets = Object.entries(budgets).reduce(
        (acc, [id, budget]) => {
          const originalBudget = categories.find(
            (category) => category.category_id === parseInt(id, 10)
          )?.budget;
          if (originalBudget !== budget) {
            acc[parseInt(id, 10)] = budget;
          }
          return acc;
        },
        {} as Record<number, number>
      );

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/user/${user!.user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newBudgets: changedBudgets }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast({
        description: "Success updating category budgets.",
      });
      await queryClient.invalidateQueries({
        queryKey: ["weeklySummary"],
      });
      nav("/dashboard");
    },
    onError: () => {
      toast({
        description: "Error updating budgets",
      });
    },
  });

  return (
    <div className="relative z-10 flex h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Circle */}
      <div className="bg-blush absolute left-[-30%] top-[-10%] h-[150%] w-[80%] rounded-full md:left-[-35%] md:h-[150%] md:w-[70%]"></div>

      <div className="relative z-20 flex w-full max-w-6xl items-center justify-between">
        {/* Text Inside the Circle */}
        <h1 className="ml-[-5rem] text-4xl font-bold text-gray-700 sm:text-5xl md:text-6xl">
          Edit your <br />
          Categories:
        </h1>

        <div className="relative flex w-full max-w-md items-center">
          <Carousel className="relative w-full">
            <CarouselContent>
              {categories.map((category) => (
                <CarouselItem
                  key={category.category_id}
                  className="flex items-center justify-center"
                >
                  <Card className="w-full max-w-[300px] rounded-xl shadow-lg md:max-w-[400px]">
                    <CardContent
                      className="flex flex-col items-center justify-center p-6 md:p-8"
                      style={{ backgroundColor: category.category_color }}
                    >
                      <div className="mb-4 flex items-center">
                        <p className="mr-2 text-xl text-white md:text-2xl">₱</p>
                        <input
                          type="number"
                          value={budgets[category.category_id!] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleBudgetChange(
                              category.category_id!,
                              value === "" ? 0 : parseInt(value, 10) || 0
                            );
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              handleBudgetChange(category.category_id!, 0);
                            }
                          }}
                          className="w-[100px] rounded-md border border-gray-300 p-2 text-center text-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 md:w-[150px] md:text-2xl"
                        />
                      </div>

                      <h3 className="text-2xl font-bold text-white md:text-4xl">
                        {category.category_name}
                      </h3>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-[-2rem] top-1/2 z-10 -translate-y-1/2" />
            <CarouselNext className="absolute right-[-2rem] top-1/2 z-10 -translate-y-1/2" />
          </Carousel>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => mutate()}
        className="bg-green fixed bottom-8 right-8 rounded-full px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        SAVE
      </button>
    </div>
  );
};

export default WrapupEditCategory;
