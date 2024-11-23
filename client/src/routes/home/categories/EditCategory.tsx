import React, { useState, useRef } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";
import { Link, useLoaderData } from "react-router-dom";
import { Category } from "../../../interfaces/Category";
import { BackendResponse } from "../../../interfaces/response";
import { useMutation } from "@tanstack/react-query";

const AddCategory = () => {
  const { data: category } = useLoaderData() as BackendResponse<Category>;

  const [categoryName, setCategoryName] = useState<string>(
    category.category_name
  );
  const [budget, setBudget] = useState<number | 0>(category.budget);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    category.category_color
  );
  // const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    category.background_image_url ?? null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate } = useMutation({
    mutationFn: async (newCategory: Category) => {
      console.log(newCategory);

      await fetch(`http://localhost:3000/category/${category.category_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
    },
  });

  const handleReset = () => {
    setCategoryName(category.category_name);
    setBudget(category.budget);
    setBackgroundColor(category.category_color);
    // setBackgroundImage(null);
    setImagePreviewUrl(category.background_image_url ?? "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      category_id: category.category_id,
      category_name: categoryName,
      budget: budget,
      category_color: backgroundColor,
      background_image_url: imagePreviewUrl ?? category.background_image_url,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // setBackgroundImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    // setBackgroundImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg flex-col gap-2"
      >
        <h1 className="text-center text-2xl font-bold text-black">
          Edit Category
        </h1>

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
          <label htmlFor="budget" className="text-sm font-medium text-gray-700">
            Budget
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Background Image
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="backgroundImage"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 rounded-md bg-teal-800 px-4 py-2 font-bold text-white"
            >
              Choose File
            </button>
          </div>
        </div>

        {imagePreviewUrl && (
          <div className="relative mb-4">
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="h-64 w-full rounded-md object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-black transition duration-200 hover:bg-red-600"
            >
              X
            </button>
          </div>
        )}
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

export default AddCategory;
