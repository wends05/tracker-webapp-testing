// import { SavedCategories } from "@/utils/types";
// import { FormEvent, useState } from "react";
// import { CATEGORY_COLORS } from "../../../utils/constants";
// import { useLoaderData, useNavigate } from "react-router-dom";
// import { useQueryClient, useMutation } from "@tanstack/react-query";
// import { toast } from "@/hooks/use-toast";
// import { Trash } from "lucide-react";

// const EditSavedCategory = () => {
//   const savedCategories = useLoaderData() as SavedCategories;
//   const nav = useNavigate();

//   const queryClient = useQueryClient();
//   const [savedCategoriesData, setsavedCategoriesData] =
//     useState<SavedCategories>(savedCategories);

//   const { mutate } = useMutation({
//     mutationFn: async (e: FormEvent) => {
//       e.preventDefault();

//       if (savedCategories.budget < savedCategories.amount_spent) {
//         throw Error(
//           `Your budget is lower than your amount spent. Amount spent is ${savedCategories.amount_spent}.`
//         );
//       }

//       const newAmountLeft =
//         savedCategories.budget - savedCategories.amount_spent;
//     },
//   });

//   return (
//     <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
//       <div
//         className="absolute h-full w-full bg-black opacity-60"
//         onClick={closeForm}
//       ></div>{" "}
//       <form
//         onSubmit={mutate}
//         className="z-10 flex w-full max-w-2xl flex-col gap-2 rounded-3xl bg-white p-6"
//       >
//         <div className="mb-5 flex items-center justify-between">
//           <h1 className="text-left text-xl font-bold text-black">
//             Edit Category
//           </h1>
//           <button
//             className="text-darkCopper p-1 hover:text-red-600"
//             type="button"
//             onClick={() => deleteCategory.mutate()}
//           >
//             <Trash className="h-6 w-6"></Trash>
//           </button>
//         </div>

//         <div className="mb-5 flex flex-row space-x-10">
//           <div>
//             <label
//               htmlFor="categoryName"
//               className="mb-3 text-sm font-medium text-gray-700"
//             >
//               Category Name
//             </label>
//             <input
//               type="text"
//               id="categoryName"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               required
//               className="border-darkCopper h-auto w-full rounded-2xl border p-2 shadow-sm focus:ring-blue-500"
//               placeholder="Enter category name"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="budget"
//               className="mb-3 text-sm font-medium text-gray-700"
//             >
//               Budget
//             </label>
//             <input
//               type="number"
//               id="budget"
//               step={0.01}
//               value={budget}
//               onChange={(e) => setBudget(Number(e.target.value) || budget)}
//               required
//               className="border-darkCopper block w-full rounded-2xl border p-2 focus:ring focus:ring-blue-500"
//               placeholder="Enter budget"
//             />
//           </div>
//         </div>

//         <div>
//           <div>
//             <label
//               htmlFor="description"
//               className="mb-3 flex text-sm font-medium text-gray-700"
//             >
//               Category Description
//               <p className="text-gray-400">(Optional)</p>
//             </label>
//           </div>

//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="border-darkCopper h-20 w-full resize-none rounded-2xl border p-4 focus:ring focus:ring-blue-500"
//             placeholder="Enter category description"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium text-gray-700">
//             Category Color:
//           </label>
//           <div className="mt-1 flex space-x-2">
//             {CATEGORY_COLORS.map((color) => (
//               <div
//                 key={color}
//                 onClick={() => setBackgroundColor(color)}
//                 className={`h-10 w-10 cursor-pointer rounded-full border-2 transition duration-1000 ${
//                   backgroundColor === color
//                     ? "border-black"
//                     : "border-transparent"
//                 }`}
//                 style={{ backgroundColor: color }}
//               ></div>
//             ))}
//           </div>
//         </div>

//         {/* <button
//           className="w-full rounded-md bg-neutral-600 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
//           type="button"
//         >
//           <Link to={`/category/${category.category_id}`}>Cancel</Link>
//         </button> */}
//         {/* <button
//           className="w-full rounded-md bg-red-600 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
//           type="reset"
//           onClick={handleReset}
//         >
//           Reset
//         </button> */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="text-darkCopper w-1/4 rounded-full border-2 bg-[#487474] p-5 font-semibold transition duration-200"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditSavedCategory;
