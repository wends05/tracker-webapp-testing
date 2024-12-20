import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Expense } from "@/utils/types";
import { Category } from "@/utils/types";
import { BackendResponse } from "@/interfaces/BackendResponse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BackendError } from "@/interfaces/ErrorResponse";

const getCurrentWeekRange = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { startOfWeek, endOfWeek };
};

const AddExpense = () => {
  const queryClient = useQueryClient();
  const { category_id } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(1.0);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [timeDate, setTimeDate] = useState<Date | null>(new Date());

  const { startOfWeek, endOfWeek } = getCurrentWeekRange();

  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  const { data: category } = useQuery<Category>({
    queryKey: ["category", category_id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category_id}`
      );

      if (!response.ok) {
        const { message: errorMessage } =
          (await response.json()) as BackendError;
        throw Error(errorMessage);
      }

      const { data } = (await response.json()) as BackendResponse<Category>;
      return data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();

      toast({
        description: "Adding Expense...",
      });

      if (!name.trim()) {
        throw Error("Name is required.");
      }

      if (price <= 0) {
        throw Error("Price must be greater than zero.");
      }

      if (quantity <= 0) {
        throw Error("Quantity must be greater than zero.");
      }

      if (!timeDate) {
        throw Error("Please Select date and time");
      }

      const expense: Expense = {
        expense_name: name,
        price: price,
        quantity: quantity,
        total: total,
        category_id: Number(category_id),
        date: new Date(timeDate),
      };
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
        const errorMessage = (await response.json()) as BackendError;
        throw Error(errorMessage.message);
      }

      await queryClient.invalidateQueries({
        queryKey: ["category", category_id, "expenses"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["category", category_id],
      });
    },

    onSuccess: () => {
      toast({
        description: "Expense Added!",
      });
      queryClient.invalidateQueries({
        queryKey: ["weeklySummary"],
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
            <label htmlFor="name">Expense Name:</label>
            <input
              className="focus:ring-green rounded-3xl border-2 border-black focus:ring"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="date">Day Spent:</label>
            <DatePicker
              className="focus:ring-green rounded-3xl border-2 border-black focus:ring"
              id="datetime"
              name="timeDate"
              selected={timeDate}
              minDate={startOfWeek}
              maxDate={endOfWeek}
              onChange={(date: Date | null) => setTimeDate(date)}
              required
            />
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
              value={price === 0 ? "" : price}
              step="0.01"
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="quantity">Quantity:</label>
            <input
              className="focus:ring-green rounded-3xl border-2 border-black focus:ring"
              type="text"
              id="quantity"
              name="quantity"
              value={quantity === 0 ? "" : quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
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
              value={total ? total : 0}
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

export default AddExpense;
