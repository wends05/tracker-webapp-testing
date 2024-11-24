import React, { useState, useRef } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";

interface AddCategoryProps {
  onAddCategory: (category: {
    categoryName: string;
    budget: number;
    backgroundColor: string;
    backgroundImage: File | null;
  }) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ onAddCategory }) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [budget, setBudget] = useState<number | "">("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [categoryNameError, setCategoryNameError] = useState<string | null>(
    null
  );
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasEmptyField = false;

    if (!categoryName) {
      setCategoryNameError("Category name is required.");
      hasEmptyField = true;
    } else {
      setCategoryNameError(null);
    }

    if (!budget || budget <= 0) {
      setBudgetError("Enter valid budget.");
      hasEmptyField = true;
    } else {
      setBudgetError(null);
    }

    if (hasEmptyField) return;

    onAddCategory({
      categoryName,
      budget: Number(budget),
      backgroundColor,
      backgroundImage,
    });

    setCategoryName("");
    setBudget("");
    setBackgroundColor("");
    setBackgroundImage(null);
    setImagePreviewUrl(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackgroundImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setBackgroundImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button */}
        <button
          onClick={() => onAddCategory(null)} // Close the modal
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Add Category
          </h1>

          <div>
            <label
              htmlFor="categoryName"
              className="text-sm font-medium text-gray-700"
            >
              Category Name:
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className={`w-full rounded-lg border p-3 shadow-sm ${
                categoryNameError ? "border-red-600" : "border-gray-300"
              }`}
              placeholder="Enter category name"
            />
            {categoryNameError && (
              <p className="mt-1 text-xs text-red-600">{categoryNameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="budget" className="text-sm font-medium text-gray-700">
              Budget:
            </label>
            <input
              type="number"
              id="budget"
              value={budget === 0 ? "" : budget}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
              className={`w-full rounded-lg border p-3 shadow-sm ${
                budgetError ? "border-red-600" : "border-gray-300"
              }`}
              placeholder="Enter budget"
            />
            {budgetError && (
              <p className="mt-1 text-xs text-red-600">{budgetError}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Select Background Color:
            </label>
            <div className="mt-2 flex space-x-2">
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
            <label className="text-sm font-medium text-gray-700">
              Upload Background Image:
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
                className="rounded-md bg-teal-800 px-4 py-2 font-bold text-white"
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
            type="submit"
            className="w-full rounded-md bg-teal-800 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
