import { useState } from "react";
import { Expense } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ExpenseBox = ({
  expense_id,
  expense_name,
  price,
  quantity,
  total,
  category_id,
  date,
  saved_category_id,
}: Expense) => {
  const [isOpen, setIsOpen] = useState(false); // State to control popover visibility
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: handleDeleteExpense, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/expense/${expense_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      } else {
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        description: "Expense successfully deleted",
      });

      if (category_id) {
        queryClient.refetchQueries({
          queryKey: ["category", category_id, "expenses"],
        });
        queryClient.invalidateQueries({
          queryKey: ["category", category_id],
        });
      }

      if (saved_category_id) {
        queryClient.refetchQueries({
          queryKey: ["savedCategory", saved_category_id, "expenses"],
        });
        queryClient.invalidateQueries({
          queryKey: ["savedCategory", saved_category_id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["weeklySummary"],
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oh no!",
        description: `Expense unsuccessfully deleted: ${error.message}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleEditExpense = () => {
    if (!isPending) {
      nav(`expense/${expense_id}/edit`);
    }
  };

  const closePopover = () => setIsOpen(false);

  const monthString = new Date(date!).toLocaleString("default", {
    month: "long",
  });
  const dateString = new Date(date!).getDate();
  const yearString = new Date(date!).getFullYear();
  const dayNum = new Date(date!).getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayString = daysOfWeek[dayNum];

  return (
    <div className="flex h-auto transform flex-row justify-between rounded-t-xl border-b-2 border-black p-2 px-8 duration-200 ease-in">
      <div className="flex flex-col">
        <h2 className="font-bold">{expense_name}</h2>
        <h6>
          {price} x {quantity}
        </h6>

        <div className="pt-14">
          <h2>{total} PHP</h2>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="mt-7 pb-7">
          <h2>
            {monthString} {dateString}, {yearString}
          </h2>
          <div className="flex justify-end">
            <h2>{dayString}</h2>
          </div>
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <BsThreeDotsVertical className="h-6 w-6 cursor-pointer hover:rounded-full hover:bg-slate-300" />
          </PopoverTrigger>

          <PopoverContent className="w-46 pl-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="hover:bg-slate-200">
                  <PiTrash size={30} />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this expense? Expense name:{" "}
                    {expense_name}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>NO</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDeleteExpense();
                      closePopover();
                    }}
                  >
                    YES
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <button
              className="hover:bg-slate-200"
              onClick={() => {
                handleEditExpense();
                closePopover();
              }}
            >
              <PiNotePencil size={30} />
            </button>
          </PopoverContent>
        </Popover>

        {isPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
            <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseBox;
