import { useMutation, useQueryClient } from "@tanstack/react-query";
import Expense from "../../../types/Expense";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AddExpense = () => {
  const queryClient = useQueryClient();
  const { category } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(1.0);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (expense: Expense) => {},
    onSuccess: () => {},
    onError: () => {},
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const expense = {};
    // mutate(expense)
  };

  return (
    <div className="flex h-full items-center justify-center bg-slate-600">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[350px] flex-col gap-2 px-12"
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
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
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
          value={total ? total : 0}
          disabled
        />

        <button type="submit" disabled={isPending}>
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
