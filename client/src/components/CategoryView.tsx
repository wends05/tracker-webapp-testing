import { Category } from "@/utils/types";
import { Link } from "react-router-dom";

const CategoryView = (category: { category: Category }) => {
  const { category_id, category_color, category_name, budget } =
    category.category;
  return (
    <div className="relative flex h-48 items-center justify-center rounded-lg shadow-lg mx-5 my-5">
      <Link
        to={`/category/${category_id}`}
        className="relative w-full h-full p-4 rounded-lg flex flex-col justify-between"
        style={{
          backgroundColor: category_color || "#f3f3f3",
        }}
      >
        <div className="relative z-10">
          <h3 className="text-lg font-medium">{category_name}</h3>
          <p className="mt-1 text-sm">Total Budget: ₱{budget}</p>
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
