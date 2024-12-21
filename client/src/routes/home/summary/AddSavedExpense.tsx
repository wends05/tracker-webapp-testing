import { toast } from "@/hooks/use-toast";
import { BackendResponse } from "@/interfaces/BackendResponse";
import { Expense, SavedCategories, WeeklySummary } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { BackendError } from "@/interfaces/ErrorResponse";

const AddSavedExpense = () => {
  const { saved_category_id } = useParams();

  const { data: category } = useQuery<SavedCategories>({
    queryKey: ["savedCategory", saved_category_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/savedCategories/${saved_category_id}`
      );

      if (!response.ok) {
        const { message } = (await response.json()) as { message: string };
        throw Error(message);
      }

      const { data } =
        (await response.json()) as BackendResponse<SavedCategories>;
      return data;
    },
  });

  const { data: weeklySummary } = useQuery<WeeklySummary>({
    enabled: !!category,
    queryKey: ["weeklySummary", category?.weekly_summary_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/summary/${category?.weekly_summary_id}`
      );

      if (!response.ok) {
        const { message } = (await response.json()) as BackendError;
        throw Error(message);
      }

      const { data } =
        (await response.json()) as BackendResponse<WeeklySummary>;
      // setStartDate(new Date(data.date_start));
      // setEndDate(new Date(data.date_end));
      return data;
    },
  });

  const queryClient = useQueryClient();
  const nav = useNavigate();

  const [expense, setExpense] = useState<Expense>({
    expense_name: "",
    price: 0,
    quantity: 1,
    total: 0,
    date: new Date(),
    saved_category_id: Number(saved_category_id),
  });

  useEffect(() => {
    setExpense((prev) => ({
      ...prev,
      total: expense.price * expense.quantity,
    }));
  }, [expense.price, expense.quantity]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setExpense((prev) => {
      return {
        ...prev,
        [id]: id === "date" ? new Date(value) : value,
      };
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();

      if (!expense.expense_name.trim()) {
        throw Error("Name is required.");
      }

      if (expense.price <= 0) {
        throw Error("Price must be greater than zero.");
      }

      if (expense.quantity <= 0) {
        throw Error("Quantity must be greater than zero.");
      }

      if (!expense.date) {
        throw Error("Please Select date and time");
      }

      toast({
        description: "Adding Expense...",
      });

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/expense`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense),
        }
      );
      if (!response.ok) {
        const errorMessage = (await response.json()) as {
          error: string;
          message: string;
        };
        throw Error(errorMessage.error);
      }

      await queryClient.invalidateQueries({
        queryKey: ["savedCategory", saved_category_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["savedCategory", saved_category_id, "expenses"],
      });
    },
    onSuccess: () => {
      toast({
        description: "Expense Added!",
      });
      nav(-1);
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const closeForm = () => {
    if (!isPending) {
      nav(-1);
    }
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        onClick={closeForm}
        className="absolute h-full w-full bg-black opacity-60"
      ></div>{" "}
      <form
        onSubmit={mutate}
        className="z-10 flex h-max flex-col items-center justify-center rounded-3xl bg-white px-20 py-10"
      >
        <div className="flex justify-center pb-4">
          <div className="flex flex-col items-center">
            <h1 className="text-darkCopper text-xl font-bold">Add Expense</h1>
            <h3 className="text-lg">Money left: ₱{category?.amount_left}</h3>
          </div>
        </div>

        {isPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
            <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
          </div>
        )}

        <div className="flex w-full justify-between gap-x-20 pb-6">
          <div className="flex flex-1 flex-col">
            <label htmlFor="expense_name">Expense Name:</label>
            <input
              className="focus:ring-green rounded-3xl border-2 border-black focus:ring"
              type="text"
              id="expense_name"
              name="expense_name"
              value={expense.expense_name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="date">Day Spent:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "focus:ring-green rounded-3xl border-2 border-black focus:ring",
                    !formatter.format(expense.date) && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatter.format(expense.date) ? (
                    formatter.format(expense.date)
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {weeklySummary ? (
                  <Calendar
                    id="date"
                    mode="single"
                    onSelect={(date: Date | undefined) =>
                      setExpense((prev) => ({
                        ...prev,
                        date: date || new Date(),
                      }))
                    }
                    fromDate={new Date(weeklySummary.date_start)}
                    toDate={new Date(weeklySummary.date_end)}
                    initialFocus
                  />
                ) : (
                  <div className="p-4 text-center">Loading calendar...</div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex w-full justify-between gap-x-20 pb-6">
          <div className="flex flex-1 flex-col">
            <label htmlFor="price">Price:</label>
            <input
              className="focus:ring-green rounded-3xl border-2 border-black focus:ring"
              type="number"
              id="price"
              name="price"
              value={expense.price === 0 ? "" : expense.price}
              step="0.01"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="quantity">Quantity:</label>
            <input
              className="focus:ring-green rounded-3xl border-2 border-black focus:ring"
              type="text"
              id="quantity"
              name="quantity"
              value={expense.quantity === 0 ? "" : expense.quantity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-2">
            <label htmlFor="total">Total:</label>
            <input
              className="rounded-2xl bg-[#eaffed]"
              type="text"
              id="total"
              name="quantity"
              value={expense.total ? expense.total : 0}
              disabled
            />
          </div>

          {/* <button type="button" className="cancel" onClick={closeForm}>
                  Cancel
                </button> */}

          <button
            type="submit"
            disabled={isPending}
            className="text-darkCopper mt-auto rounded-full bg-[#487474] px-4 py-2 text-sm font-semibold transition duration-200"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSavedExpense;
