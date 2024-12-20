import React, { useState, FormEvent, useEffect } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";

import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/utils/types";
import getUser from "@/utils/getUser";
import { bouncy } from "ldrs";
import { BackendError } from "@/interfaces/ErrorResponse";

bouncy.register();

const AddCategory: React.FC = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  useEffect(() => {
    console.log(user);
  }, [user]);

  const [categoryName, setCategoryName] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#7a958f");
  const [categoryNameError, setCategoryNameError] = useState<string | null>(
    null
  );
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const nav = useNavigate();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();

      let hasEmptyField = false;

      if (!categoryName) {
        setCategoryNameError("Category name is required.");
        hasEmptyField = true;
      } else {
        setCategoryNameError(null);
      }

      if (!budget || parseFloat(budget) <= 0) {
        setBudgetError("Enter valid budget.");
        hasEmptyField = true;
      } else {
        setBudgetError(null);
      }

      if (hasEmptyField) throw Error("Some fields are empty.");

      toast({
        description: "Adding Category...",
      });

      const category: Category = {
        budget: parseFloat(budget),
        category_color: backgroundColor,
        category_name: categoryName,
        description: description || "",
        user_id: user!.user_id!,
        amount_left: parseFloat(budget) || 0,
        amount_spent: 0,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as BackendError;
        throw new Error(errorData.message || "Failed to add category");
      }

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["weeklySummary"],
      });
    },
    onSuccess: () => {
      toast({
        description: "Category added!",
      });
      nav(-1);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
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
        className="absolute h-full w-full bg-black opacity-60"
        onClick={closeForm}
      ></div>
      <form
        onSubmit={mutate}
        className="z-10 flex w-full max-w-2xl flex-col gap-2 rounded-3xl bg-white p-6"
      >
        <h1 className="text-left text-xl font-bold text-black">Add Category</h1>

        {isPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
            <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
          </div>
        )}

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
              className={`h-auto w-full rounded-2xl border border-black p-2 focus:ring-blue-500 ${
                categoryNameError ? "border-red-600" : "border-black"
              }`}
              placeholder="Enter category name"
            />
            {categoryNameError && (
              <p className="mt-1 text-xs text-red-600">{categoryNameError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="budget"
              className="text-sm font-medium text-gray-700"
            >
              Budget
            </label>
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`h-auto w-full rounded-2xl border border-black p-2 focus:ring-blue-500 ${
                budgetError ? "border-red-600" : "border-black"
              }`}
              placeholder="Enter budget"
            />
            {budgetError && (
              <p className="mt-1 text-xs text-red-600">{budgetError}</p>
            )}
          </div>
        </div>

        <div>
          <div>
            <label
              htmlFor="description"
              className="mb-3 flex text-sm font-medium text-gray-700"
            >
              Description
              <p className="text-gray-400">(Optional):</p>
            </label>
          </div>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`h-20 w-full resize-none rounded-2xl border border-black p-4 focus:ring focus:ring-blue-500 ${
              categoryNameError ? "border-red-600" : "border-black"
            }`}
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
                    ? "border-gray-950"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="text-darkCopper w-1/4 rounded-full border-2 bg-[#487474] p-5 font-semibold transition duration-200"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
