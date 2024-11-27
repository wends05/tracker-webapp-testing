import { Category } from "@/utils/types";
import { Link, useNavigate } from "react-router-dom";

const CategoryView = (category: { category: Category }) => {
  const { category_id, category_color, category_name, budget } =
    category.category;

  const nav = useNavigate();
  return (
    <div className="relative mx-5 my-5 flex h-48 items-center justify-center rounded-lg shadow-lg">
      <Link
        to={`/category/${category_id}`}
        className="relative flex h-full w-full flex-col justify-between rounded-lg p-4"
        style={{
          backgroundColor: category_color || "#f3f3f3",
        }}
      >
        <div className="relative">
          <h3 className="text-lg font-medium">{category_name}</h3>
          <p className="mt-1 text-sm">Total Budget: ₱{budget}</p>
        </div>
      </Link>
      <button
        className="absolute right-2 top-2 rounded bg-rose-500 px-2 py-1 text-xs text-white hover:bg-rose-600"
        onClick={() => nav(`category/${category_id}/edit`)}
      >
        Edit
      </button>
    </div>
  );
};

export default CategoryView;
