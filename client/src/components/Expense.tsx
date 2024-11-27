// import { useState } from "react";
import { Expense } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
// import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";

const ExpenseBox = ({
  expense_id,
  expense_name,
  price,
  quantity,
  total,
  category_id,
}: Expense) => {
  const queryClient = useQueryClient();
  const { mutate: handleDeleteExpense } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `http://localhost:3000/expense/${expense_id}`,
        {
          method: "DELETE",
        }
      );
      console.log("Expense ID:", expense_id);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorResponse = await response.json();
        console.log(errorResponse.message);
        throw new Error(errorResponse.message);
      } else {
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        description: "Expense successfully deleted",
        className: "bg-  text-white",
      });
      queryClient.invalidateQueries({
        queryKey: ["category", category_id, "expenses"],
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Oh no!",
        description: "expense unsuccessfully deleted",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });
  const handleEditExpense = () => {
    console.log("edit this.. this is edit");
  };

  return (
    <div className="mx-16 mt-3 flex h-auto flex-row flex-nowrap justify-between border-b-2 border-b-black p-3">
      <div className="flex flex-col">
        <h2 className="flex truncate text-wrap font-bold"> {expense_name} </h2>
        <h6 className="flex">
          {" "}
          {price} x {quantity}{" "}
        </h6>

        {/* <h6 className="flex">1000</h6> */}

        <div className="mt-7">
          <h2>{total} PHP</h2>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <button className="" onClick={handleEditExpense}>
          <PiNotePencil size={30} className="wx-32" />
        </button>

        <Drawer>
          <DrawerTrigger>
            <PiTrash size={30} className="m-0 mt-5 flex p-0" />
          </DrawerTrigger>
          <DrawerContent className="mx-auto items-center justify-center rounded-lg bg-white shadow-lg sm:max-w-[425px]">
            <DrawerHeader>
              <DrawerTitle>
                Are you sure you want to delete this expense? Expense name:{" "}
                {expense_name}
              </DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flext flex-row justify-center">
              <button onClick={() => handleDeleteExpense()}>
                <Button variant="outline"> Yes </Button>
              </button>
              <DrawerClose>
                <button>
                  <Button variant="outline"> No </Button>
                </button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ExpenseBox;
