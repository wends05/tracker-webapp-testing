import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { BackendResponse } from "../../../interfaces/response";
import Expense from "../../../types/Expense";
import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MdPauseCircleFilled } from "react-icons/md";

const EditExpense = () => {
  const { data: expense } = useLoaderData() as BackendResponse<Expense>;

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
    mutationFn: async (newExpense: Expense) => {
      await fetch(`http://localhost:3000/expense/${expense.expense_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });
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

  const submitForm = (e: FormEvent) => {
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
    mutate(newExpense);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <form
        onSubmit={submitForm}
        className="flex flex-col gap-2 items-center justify-center max-w-sm w-screen"
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
          onChange={(e) => setPrice(parseFloat(e.target.value))}
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

        <button type="submit" disabled={isPending}>Edit Expense</button>
      </form>
    </div>
  );
};

export default EditExpense;
