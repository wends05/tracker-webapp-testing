import { useState, FormEvent } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Category } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";

const EditCategory = () => {
  const category = useLoaderData() as Category;
  const nav = useNavigate();

  const queryClient = useQueryClient();

  const [categoryName, setCategoryName] = useState<string>(
    category.category_name
  );
  const [budget, setBudget] = useState<number | null>(category.budget);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    category.category_color
  );

  const [description, setDescription] = useState<string>("");
  const { mutate } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();

      const final_budget = budget ?? 0;

      if (final_budget < category.amount_spent) {
        throw Error(
          `Your budget is lower than your amount spent. Amount spent is ${category.amount_spent}.`
        );
      }

      const newAmountLeft = final_budget - category.amount_spent;

      const newCategory: Category = {
        category_id: category.category_id,
        category_name: categoryName,
        budget: final_budget,
        category_color: backgroundColor,
        amount_left: newAmountLeft,
        description: description,
        amount_spent: category.amount_spent,
        user_id: category.user_id,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category.category_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        }
      );

      if (!response.ok) {
        const { error } = await response.json();
        throw Error(error);
      }
    },

    onSuccess: () => {
      toast({
        description: "Category edited!",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", category.category_id],
      });
      closeForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error editing category",
        description: error.message,
      });
    },
  });

  const handleReset = () => {
    setCategoryName(category.category_name);
    setBudget(category.budget);
    setBackgroundColor(category.category_color);
  };

  const closeForm = () => {
    nav(-1);
  };

  const deleteCategory = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/${category.category_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete category");
      }
    },
    onSuccess: () => {
      toast({
        description: "Category successfully deleted",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", category.category_id],
      });
      closeForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "An error has occured huhuhu",
      });
    },
  });

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-100">
      <div
        className="absolute h-full w-full bg-black opacity-60"
        onClick={closeForm}
      ></div>{" "}
      <form
        onSubmit={mutate}
        className="z-10 flex w-full max-w-lg flex-col gap-2 rounded-md bg-white p-5"
      >
        <div className="justify between flex items-center">
          <h1 className="text-left text-2xl font-bold text-black">
            Edit Category
          </h1>
          <button
            className="p-1 text-red-500 hover:text-red-700"
            type="button"
            onClick={() => deleteCategory.mutate()}
          >
            <Trash className="h-6 w-6"></Trash>
          </button>
        </div>

        <div>
          <label
            htmlFor="categoryName"
            className="text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-blue-500"
            placeholder="Enter category description"
          />
        </div>

        <div>
          <label htmlFor="budget" className="text-sm font-medium text-gray-700">
            Budget
          </label>
          <input
            type="number"
            id="budget"
            step={0.01}
            value={budget ?? ""}
            onChange={(e) => setBudget(Number(e.target.value) || null)}
            required
            className="block w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-blue-500"
            placeholder="Enter budget"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Select Background Color
          </label>
          <div className="mt-1 flex space-x-2">
            {CATEGORY_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`h-10 w-10 cursor-pointer rounded-full border-2 ${
                  backgroundColor === color
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <button
          className="w-full rounded-md bg-neutral-600 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          type="button"
        >
          <Link to={`/category/${category.category_id}`}>Cancel</Link>
        </button>
        <button
          className="w-full rounded-md bg-red-600 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          type="reset"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          type="submit"
          className="w-full rounded-md bg-teal-800 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
        >
          Edit Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
