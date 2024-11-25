import { Category } from "@/utils/types";
import React from "react";
import { Link } from "react-router-dom";

const CategoryView = ({
  budget,
  category_color,
  category_name,
  category_id,
}: Category) => {
  return (
    <div className="relative">
      <Link to={`/category/${category_id}`}>
        <div
          className="relative rounded-lg p-4 text-black shadow"
          style={{
            backgroundColor: category_color || "#f3f3f3",
          }}
        >
          <div className="relative z-10">
            <h3 className="text-lg font-medium">{category_name}</h3>
            <p className="mt-1 text-sm">Total Budget: ₱{budget}</p>
          </div>
        </div>
      </Link>
      <button
        className="absolute right-2 top-2 rounded bg-rose-500 px-2 py-1 text-xs text-white hover:bg-rose-600"
        onClick={() => alert(`Edit ${category_name}`)}
      >
        Edit
      </button>
    </div>
  );
};

export default CategoryView;
