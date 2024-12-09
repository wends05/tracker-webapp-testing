import { useState } from "react";
import { Category } from "@/utils/types";

interface CategorySorterProps {
  categories: Category[] | undefined;
  onSort: (sortedCategories: Category[]) => void;
}

const CategorySorter = ({ categories, onSort }: CategorySorterProps) => {
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [isAscending, setIsAscending] = useState(false);
  const [previousIsAscending, setPreviousIsAscending] = useState(false);

  const handleSort = (sortBy: string, isAscending: boolean) => {
    if (sortOrder === sortBy && isAscending === previousIsAscending) {
      setSortOrder(null);
      setIsAscending(false);
      setPreviousIsAscending(false);
      onSort(categories || []);
      return;
    }

    setSortOrder(sortBy);
    setIsAscending(isAscending);
    setPreviousIsAscending(isAscending);
    const sortedCategories = categories?.slice().sort((a, b) => {
      if (sortBy === "budget") {
        return isAscending ? a.budget - b.budget : b.budget - a.budget;
      } else if (sortBy === "spent") {
        return isAscending
          ? a.amount_spent - b.amount_spent
          : b.amount_spent - a.amount_spent;
      } else if (sortBy === "left") {
        return isAscending
          ? a.amount_left - b.amount_left
          : b.amount_left - a.amount_left;
      }
      return 0;
    });
    onSort(sortedCategories || []);
  };

  return (
    <div className="mb-4 flex overflow-scroll">
      <div className="flex gap-2">
        <button
          className={`min-w-fit rounded-md border border-[#7A9590] px-4 py-2 text-sm font-semibold ${
            sortOrder === "budget" && isAscending
              ? "bg-[#7A9590] text-white"
              : "text-[#7A9590]"
          }`}
          onClick={() => handleSort("budget", true)}
        >
          Budget: Low to High
        </button>
        <button
          className={`min-w-fit rounded-md border border-[#7A9590] px-4 py-2 text-sm font-semibold ${
            sortOrder === "budget" && !isAscending
              ? "bg-[#7A9590] text-white"
              : "text-[#7A9590]"
          }`}
          onClick={() => handleSort("budget", false)}
        >
          Budget: High to Low
        </button>
        <button
          className={`min-w-fit rounded-md border border-[#7A9590] px-4 py-2 text-sm font-semibold ${
            sortOrder === "spent" && isAscending
              ? "bg-[#7A9590] text-white"
              : "text-[#7A9590]"
          }`}
          onClick={() => handleSort("spent", true)}
        >
          Spent: Low to High
        </button>
        <button
          className={`min-w-fit rounded-md border border-[#7A9590] px-4 py-2 text-sm font-semibold ${
            sortOrder === "spent" && !isAscending
              ? "bg-[#7A9590] text-white"
              : "text-[#7A9590]"
          }`}
          onClick={() => handleSort("spent", false)}
        >
          Spent: High to Low
        </button>
        <button
          className={`min-w-fit rounded-md border border-[#7A9590] px-4 py-2 text-sm font-semibold ${
            sortOrder === "left" && isAscending
              ? "bg-[#7A9590] text-white"
              : "text-[#7A9590]"
          }`}
          onClick={() => handleSort("left", true)}
        >
          Remaining: Low to High
        </button>
        <button
          className={`min-w-fit rounded-md border border-[#7A9590] px-4 py-2 text-sm font-semibold ${
            sortOrder === "left" && !isAscending
              ? "bg-[#7A9590] text-white"
              : "text-[#7A9590]"
          }`}
          onClick={() => handleSort("left", false)}
        >
          Remaining: High to Low
        </button>
      </div>
    </div>
  );
};

export default CategorySorter;
