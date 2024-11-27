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
  expense_name,
  price,
  quantity,
  total,
  category_id,
}: Expense) => {
  const queryClient = useQueryClient();
  const { mutate: handleDeleteExpense } = useMutation({
    mutationFn: async (expense_id) => {
      const response = await fetch(
        `http://localhost:3000/expense/${expense_id}`,
        {
          method: "DELETE",
        }
      );

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
    <div className="w-364 flex-col border-2 border-black p-3">
      <div className="flex justify-evenly">
        <h1 className="justify-start">{expense_name}title</h1>
        <button onClick={handleEditExpense}>
          <PiNotePencil size={30} className="" />
        </button>
      </div>
      <div>
        <div className="flex">
          {price}100
          <div className="flex">{quantity}x 10</div>
        </div>
      </div>

      <div className="flex justify-evenly">
        {total}1000
        <button onClick={() => handleDeleteExpense()}>
          <Drawer>
            <DrawerTrigger>
              <PiTrash size={30} />
            </DrawerTrigger>
            <DrawerContent className="sm:max-w-[425px]">
              <DrawerHeader>
                <DrawerTitle>
                  Are you sure you want to delete this expense?
                </DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button variant="outline"> Yes </Button>
                <DrawerClose>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteExpense()}
                  >
                    {" "}
                    No{" "}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </button>
      </div>
    </div>
  );
};

export default ExpenseBox;
