import { Link, Outlet } from "react-router-dom";

const Category = () => {
  return (
    <div className="relative flex h-full items-center justify-center">
      <h1 className="mb-4 text-center text-2xl font-bold text-black">
        Category Page
      </h1>
      <Link to={"expense/add"}>Add Expense</Link>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Category;
