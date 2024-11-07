import React, { useRef, useState } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";

const EditCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // implement edit category logic here
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl text-black font-bold mb-4 text-center">
          Edit Category
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name:
            </label>
            <input
              type="text"
              id="categoryName"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter new category name"
            />
          </div>
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700"
            >
              Budget
            </label>
            <input
              type="text"
              id="budget"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="Enter new budget"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Select Background Color:
            </label>
            <div className="flex spae-x-2 mt-1">
              {CATEGORY_COLORS.map((color) => (
                <div
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={`w-10 h-10 cursor-pointer rounded-full border-2 ${
                    backgroundColor === color
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="" className="text-sm font-medium text-gray-700">
              Upload Background Image:
            </label>
            <div className="flex items-center flex-col">
              <input
                type="file"
                id="backgroundImage"
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 bg-teal-800 text-white font-bold py-2 px-4 rounded-md"
              >
                Choose File
              </button>
            </div>

            {imagePreviewUrl && (
              <div className="relative mb-4">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-gray-200 text-black rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition duration-200"
                >
                  &times;
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-teal-800 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
