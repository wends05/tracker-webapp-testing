import { Category } from "@/utils/types";
import { Link } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const CategoryView = (category: { category: Category }) => {
  const { category_id, category_color, category_name, budget } =
    category.category;
  return (
    <div className="relative mx-5 my-5 flex h-48 items-center justify-center rounded-lg shadow-lg">
      <Link
        to={`/category/${category_id}`}
        className="relative flex h-full w-full flex-col justify-between rounded-lg p-4"
        style={{
          backgroundColor: category_color || "#f3f3f3",
        }}
      >
        <div className="relative z-10">
          <h3 className="text-lg font-medium">{category_name}</h3>
          <p className="mt-1 text-sm">Total Budget: ₱{budget}</p>
        </div>
      </Link>
      {/* Edit Icon */}
      <button
        className="absolute right-2 top-2 rounded-full bg-rose-500 p-2 text-white hover:bg-rose-600"
        onClick={() => alert(`Edit ${category_name}`)}
      >
        <PencilSquareIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CategoryView;
