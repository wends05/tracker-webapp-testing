import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useNavigate } from "react-router-dom";
import { BackendResponse } from "../../../interfaces/BackendResponse";
import { Expense } from "@/utils/types";
import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EditExpense = () => {
  const { data: expense } = useLoaderData() as BackendResponse<Expense>;

  const nav = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(expense.expense_name);
  const [price, setPrice] = useState(expense.price);
  const [quantity, setQuantity] = useState(expense.quantity);
  const [total, setTotal] = useState(expense.total);

  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      // handle form logic
      const newExpense: Expense = {
        expense_id: expense.expense_id,
        expense_name: name,
        price,
        quantity,
        total,
        category_id: expense.category_id,
      };

      await fetch(`http://localhost:3000/expense/${expense.expense_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expense", expense.expense_id],
      });
      toast({
        description: "Expense Edited!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: `Expense not edited! Error: ${error.message}`,
      });
    },
  });

  const returnToDashboard = () => {
    nav(-1);
  };

  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        onClick={returnToDashboard}
        className="absolute h-full w-full bg-black opacity-60"
      ></div>
      <form
        onSubmit={mutate}
        className="z-10 flex w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg bg-neutral-600 px-2 py-10 text-white"
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={price}
          step="0.01"
          onChange={(e) => setPrice(parseFloat(e.target.value) || price)}
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          type="text"
          id="quantity"
          name="quantity"
          value={quantity === 0 ? "" : quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
        />

        <label htmlFor="total">Total</label>
        <input
          type="text"
          id="total"
          name="quantity"
          value={total ? total.toFixed(2) : 0}
          disabled
        />

        <button type="submit" disabled={isPending}>
          Edit Expense
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
