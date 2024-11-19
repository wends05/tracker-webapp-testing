import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { BackendResponse } from "../../../interfaces/response";
import Expense from "../../../types/Expense";
import { FormEvent, useEffect, useState } from "react";

const EditExpense = () => {
  const { data: expense } = useLoaderData() as BackendResponse<Expense>;

  const [name, setName] = useState(expense.name);
  const [price, setPrice] = useState(expense.price);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(price * quantity)
  }, [price, quantity])

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: async (newExpense: Expense) => {
      console.log(newExpense);
      await fetch(
        `http://localhost:300/expense/${newExpense.expense_id}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application.json",
          },
          body: JSON.stringify(newExpense),
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["expense", expense.expense_id]
      })
    },
  });

  const submitForm = (e: FormEvent) => {
    
    e.preventDefault()
    // handle form logic



    // mutate()
  }

  return (
    <div>
      <form>
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
          type="text"
          id="price"
          name="price"
          value={price === 0 ? "" : price}
          onChange={(e) => setPrice(Number(e.target.value) || 0)}
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          type="text"
          id="quantity"
          name="quantity"
          value={quantity === 0 ? "" : quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 0)}
        />

        <label htmlFor="total">Total</label>
        <input type="text" id="total" name="quantity" value={total} disabled />

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default EditExpense;
