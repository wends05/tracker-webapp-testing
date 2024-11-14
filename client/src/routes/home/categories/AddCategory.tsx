import React, { useState, useRef } from "react";
import { CATEGORY_COLORS } from "../../../utils/constants";
import supabase from "../../../routes/home/categories/supaDB";



const AddCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [budget, setBudget] = useState<number | "">("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [categoryNameError, setCategoryNameError] = useState<string | null>(null);
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault();

    let hasEmptyField = false;

    if (!categoryName) {
      setCategoryNameError("Category name is required.");
      hasEmptyField = true;
    } else {
      setCategoryNameError(null);
    }

    if (!budget || budget <= 0){
      setBudgetError("Enter valid budget.");
      hasEmptyField = true;
    } else {
      setBudgetError(null);
    }

    if (hasEmptyField) return;

    console.log("Category Name:", categoryName);
    console.log("Budget:", budget);
    console.log("Background Color:", backgroundColor);
    console.log("Background Image:", backgroundImage);

    // const {data} = await supabase
    // .from('Category')
    // .insert([
    //   {categoryName, budget, backgroundColor, backgroundImage}])

    // if (data) {
    //   console.log(data)
    // }
    // };

    const {data} = await supabase
    .from('Category')
    .insert([{"budget": budget, "category_color":  backgroundColor,"background_image_url": backgroundImage, "category_name": categoryName}])

    if (data) {
      console.log(data)
    }
    


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
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full flex flex-col gap-2"
      >
        <h1 className="text-2xl text-black font-bold text-center">
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
            className={`w-full p-2 border ${categoryNameError ? "border-red-600" : "border-gray-300"}`}
            placeholder="Enter category name"
          />
          {categoryNameError &&(
            <p className="text-red-600 text-xs mt-1">{categoryNameError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="budget"
            className="text-sm font-medium text-gray-700"
          >
            Budget:
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className={`block w-full p-2 border ${budgetError ? "border-red-600" : "border-gray-300"}`}
            placeholder="Enter budget"
          />
          {budgetError &&(
            <p className="text-red-500 text-xs mt-1">{budgetError}</p>
          )}
          </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Select Background Color:
          </label>
          <div className="flex space-x-2 mt-1">
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
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
              className="mt-1 bg-teal-800 text-white font-bold py-2 px-4 rounded-md"
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
              className="w-full h-64 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-gray-200 text-black rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition duration-200"
            >
              X
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-teal-800 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
