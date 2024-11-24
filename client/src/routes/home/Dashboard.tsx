import React, { useState } from "react";
import AddCategory from "../home/categories/AddCategory";

const Dashboard = () => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]); // Initialize as an empty array

  // Toggle Add Category Modal
  const toggleAddCategoryModal = () => {
    setIsAddCategoryOpen((prev) => !prev);
  };

  // Add New Category
  const addCategory = (newCategory) => {
    if (newCategory) {
      const id = Date.now(); // Generate unique ID for category
      setCategories((prevCategories) => [
        ...prevCategories,
        {
          id,
          name: newCategory.categoryName,
          budget: newCategory.budget,
          budgetLeft: newCategory.budget, // Initially, budgetLeft equals the budget
          backgroundColor: newCategory.backgroundColor,
          backgroundImage: newCategory.backgroundImage
            ? URL.createObjectURL(newCategory.backgroundImage)
            : null,
        },
      ]);
    }
    setIsAddCategoryOpen(false); // Close modal
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          Welcome, Xai <span className="wave">👋</span>
        </h1>
      </header>

      {/* Summary Part */}
      <div className="grid grid-cols-4 gap-4">
        {/* Placeholder for Summary Graph */}
        <div className="col-span-2 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-black">Summary</h2>
          <div className="flex items-center justify-around mt-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-teal-400 rounded w-3"
                  style={{ height: `${(index + 1) * 20}px` }}
                />
                <p className="text-xs mt-1">Day {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Money Left */}
        <div className="bg-white shadow rounded-lg p-4 flex flex-col justify-center">
          <h2 className="text-lg font-medium text-center text-black">
            Money Left
          </h2>
          <p className="text-3xl font-bold text-center text-black mt-2">₱5,300</p>
        </div>

        {/* Budget and Expenses */}
        <div className="space-y-4">
          {/* Current Budget */}
          <div className="bg-white shadow rounded-lg p-4 flex flex-col justify-center">
            <h2 className="text-sm font-medium text-center text-black">
              Current Budget
            </h2>
            <p className="text-2xl font-bold text-center text-black mt-2">
              ₱5,300
            </p>
          </div>

          {/* Total Expenses */}
          <div className="bg-white shadow rounded-lg p-4 flex flex-col justify-center">
            <h2 className="text-sm font-medium text-center text-black">
              Total Expenses
            </h2>
            <p className="text-2xl font-bold text-center text-black mt-2">
              ₱5,300
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-black mb-4">Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {/* Add New Category */}
          <button
            onClick={toggleAddCategoryModal}
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg h-32 shadow text-gray-500"
          >
            <span className="text-4xl">+</span>
          </button>

          {/* Render Existing Categories */}
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative text-black rounded-lg p-4 shadow"
              style={{
                backgroundColor: category.backgroundColor || "#f3f3f3",
              }}
            >
              {/* Category Background Image */}
              {category.backgroundImage && (
                <img
                  src={category.backgroundImage}
                  alt="Category Background"
                  className="absolute inset-0 h-full w-full object-cover opacity-20 rounded-lg"
                />
              )}
              <div className="relative z-10">
                <h3 className="text-lg font-medium">{category.name}</h3>
                <p className="text-sm mt-1">Budget Left: ₱{category.budgetLeft}</p>
              </div>
              <button
                className="absolute top-2 right-2 text-xs bg-rose-500 rounded px-2 py-1 hover:bg-rose-600 text-white"
                onClick={() => alert(`Edit ${category.name}`)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-3 w-full max-w-sm">
            {/* Close Button */}
            <button
              onClick={toggleAddCategoryModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            {/* AddCategory Component */}
            <AddCategory onAddCategory={addCategory} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
