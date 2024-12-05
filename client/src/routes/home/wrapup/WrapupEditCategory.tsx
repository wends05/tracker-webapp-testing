import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Category,
  Expense,
  SavedCategories,
  WeeklySummary,
} from "@/utils/types";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getUser from "@/utils/getUser";

const WrapupEditCategory = () => {
  const categories = useLoaderData() as Category[];
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

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

  const handleSave = async () => {
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

    console.log("Changed budgets:", changedBudgets);

    const previousWeekSummary: WeeklySummary = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/summaries/user/${user.user_id}/recent`
    ).then(async (res) => {
      if (res.ok) {
        const response = await res.json();
        return response;
      }
    });

    categories.forEach(async (category) => {
      const newSavedCategory: SavedCategories = {
        ...category,
        weekly_summary_id: previousWeekSummary.weekly_summary_id!,
      };
      const savedCategory: SavedCategories = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/savedCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSavedCategory),
        }
      ).then(async (res) => {
        if (res.ok) {
          const response = await res.json();
          return response;
        }
      });
      const expenses: Expense[] = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category.category_id}/expenses`
      ).then(async (res) => {
        if (res.ok) {
          const response = await res.json();
          return response;
        }
      });
      expenses.forEach((expense) => {
        expense.saved_category_id = savedCategory.saved_category_id;
        expense.category_id = undefined;

        fetch(
          `${import.meta.env.VITE_SERVER_URL}/expense/${expense.expense_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(expense),
          }
        );
      });
    });
  };

  return (
    <div className="relative z-10 flex h-screen items-center justify-center">
      <div className="bg-blush absolute -left-[20rem] top-0 h-[55rem] w-[55rem] rounded-full"></div>

      <div className="relative z-20 flex w-full max-w-6xl items-center justify-between px-16">
        <h1 className="-ml-32 text-6xl font-bold text-gray-700">
          Edit your <br />
          Categories:
        </h1>

        <div className="relative flex items-center">
          <Carousel className="relative w-full max-w-md">
            <CarouselContent>
              {categories.map((category) => (
                <CarouselItem
                  key={category.category_id}
                  className="flex items-center justify-center"
                >
                  <Card className="w-full max-w-[400px] rounded-xl shadow-lg">
                    <CardContent
                      className="flex flex-col items-center justify-center p-8"
                      style={{ backgroundColor: category.category_color }}
                    >
                      <h3 className="text-4xl font-bold text-white">
                        {category.category_name}
                      </h3>

                      <div className="mt-6 flex items-center">
                        <p className="mr-2 text-2xl text-white">₱</p>
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
                          className="w-[150px] rounded-md border border-gray-300 p-2 text-center text-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
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

      <button
        onClick={handleSave}
        className="bg-green fixed bottom-8 right-8 rounded-full px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Save
      </button>
    </div>
  );
};

export default WrapupEditCategory;
