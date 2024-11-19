import { useMutation, useQueryClient } from "@tanstack/react-query";
import Expense from "../../../types/Expense";
import { useEffect, useState } from "react";

const AddExpense = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(1.0);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  const { mutate } = useMutation({
    mutationFn: async (expense: Expense) => {
      await fetch("http://localhost:3000/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const handleSubmit = async () => {
    // add logic for error handling
    // use mutate function
    // mutate({});
  };

  return (
    <div className="bg-slate-600 w-screen h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 max-w-[350px] px-12 w-full"
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

export default AddExpense;
