import { useState, FormEvent } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Category } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import { BackendError } from "@/interfaces/ErrorResponse";

const EditCategory = () => {
  const category = useLoaderData() as Category;
  const nav = useNavigate();

  const queryClient = useQueryClient();

  const [categoryName, setCategoryName] = useState<string>(
    category.category_name
  );
  const [budget, setBudget] = useState<number | string>(category.budget);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    category.category_color
  );

  const [description, setDescription] = useState<string>(category.description);
  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();

      if (Number(budget) < category.amount_spent) {
        throw Error(
          `Your budget is lower than your amount spent. Amount spent is ${category.amount_spent}.`
        );
      }

      toast({
        description: "Editing category...",
      });

      const newAmountLeft = Number(budget) - category.amount_spent;

      const newCategory: Category = {
        category_id: category.category_id,
        category_name: categoryName,
        budget: Number(budget),
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
        const { message } = (await response.json()) as BackendError;
        throw Error(message);
      }

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      await queryClient.refetchQueries({
        queryKey: ["category", category.category_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["weeklySummary"],
      });
    },

    onSuccess: () => {
      toast({
        description: "Category edited!",
      });
      nav(-1);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error editing Category",
        description: error.message,
      });
    },
  });

  const closeForm = () => {
    if (!isPending) {
      nav(-1);
    }
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
        const { message } = (await response.json()) as {
          message: string;
        };
        throw new Error(message || "Failed to delete category");
      }
      toast({
        description: "Deleting Category",
      });
      await queryClient.refetchQueries({
        queryKey: ["categories"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["category", category.category_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["weeklySummary"],
      });
    },
    onSuccess: () => {
      toast({
        description: "Category deleted!",
      });
      nav(-1);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "An error has occured :<",
      });
    },
  });

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        className="absolute h-full w-full bg-black opacity-60"
        onClick={closeForm}
      ></div>{" "}
      <form
        onSubmit={mutate}
        className="z-10 flex w-full max-w-2xl flex-col gap-2 rounded-3xl bg-white p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-left text-xl font-bold text-black">
            Edit Category
          </h1>

          {isPending && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
              <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
            </div>
          )}

          <button
            className="text-darkCopper p-1 hover:text-red-600"
            type="button"
            onClick={() => deleteCategory.mutate()}
          >
            {isPending && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
                <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
              </div>
            )}
            <Trash className="h-6 w-6"></Trash>
          </button>
        </div>

        <div className="mb-5 flex flex-row space-x-10">
          <div>
            <label
              htmlFor="categoryName"
              className="mb-3 text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="border-darkCopper h-auto w-full rounded-2xl border p-2 shadow-sm focus:ring-blue-500"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label
              htmlFor="budget"
              className="mb-3 text-sm font-medium text-gray-700"
            >
              Budget
            </label>
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value || "")}
              required
              className="border-darkCopper block w-full rounded-2xl border p-2 focus:ring focus:ring-blue-500"
              placeholder="Enter budget"
            />
          </div>
        </div>

        <div>
          <div>
            <label
              htmlFor="description"
              className="mb-3 flex text-sm font-medium text-gray-700"
            >
              Description
              <p className="text-gray-400">(Optional)</p>
            </label>
          </div>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-darkCopper h-20 w-full resize-none rounded-2xl border p-4 focus:ring focus:ring-blue-500"
            placeholder="Enter category description"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Category Color
          </label>
          <div className="mt-1 flex space-x-2">
            {CATEGORY_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`h-10 w-10 cursor-pointer rounded-full border-2 transition duration-700 ${
                  backgroundColor === color
                    ? "border-black"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        {/* <button
          className="w-full rounded-md bg-neutral-600 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          type="button"
        >
          <Link to={`/category/${category.category_id}`}>Cancel</Link>
        </button> */}
        {/* <button
          className="w-full rounded-md bg-red-600 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          type="reset"
          onClick={handleReset}
        >
          Reset
        </button> */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="text-darkCopper w-1/4 rounded-full border-2 bg-[#487474] p-5 font-semibold transition duration-200"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
