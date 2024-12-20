import { Category } from "@/utils/types";
import { Link } from "react-router-dom";
import { PencilLine } from "lucide-react";

const CategoryView = (category: { category: Category }) => {
  const { category_id, category_color, category_name, budget } =
    category.category;

  return (
    <div className="relative mx-5 my-5 flex h-48 items-center justify-center rounded-lg shadow-lg">
      <Link
        to={`/category/${category_id}`}
        className="relative flex h-full w-full flex-col justify-end rounded-lg p-4"
        style={{
          backgroundColor: category_color || "#7a958f",
        }}
      >
        <div className="absolute bottom-2 left-2">
          <h3 className="text-2xl font-semibold text-white">{category_name}</h3>
          <p className="mt-1 text-sm text-white">Total Budget: ₱{budget}</p>
        </div>
      </Link>

      <Link
        className="absolute right-2 top-2 rounded px-2 py-1 text-xs text-white hover:text-rose-600"
        to={`category/${category_id}/edit`}
      >
        <PencilLine className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default CategoryView;
