// import { useState } from "react";
import { Expense } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
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
import { useNavigate } from "react-router-dom";
// import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";

const ExpenseBox = ({
  expense_name,
  price,
  quantity,
  total,
  expense_id,
}: Expense) => {
  const nav = useNavigate();
  const { mutate: handleDeleteExpense } = useMutation({
    mutationFn: async () => {
      console.log("deleted expense");
    },
  });
  const handleEditExpense = () => {
    nav(`expense/${expense_id}/edit`);
  };

  return (
    <Drawer>
      <div className="flex h-auto flex-row flex-nowrap justify-between border-b-2 border-black p-3">
        <div className="flex flex-col">
          <h1 className="flex h-auto truncate text-wrap">{expense_name}</h1>
          <div>
            <div className="flex">
              {price} x {quantity}
            </div>
          </div>
          <div>{total}</div>
        </div>

        <div className="flex flex-col items-end">
          <button className="" onClick={handleEditExpense}>
            <PiNotePencil size={30} className="wx-32" />
          </button>

          <DrawerTrigger>
            <PiTrash size={30} className="m-0 p-0" />
          </DrawerTrigger>
        </div>
      </div>
      <DrawerContent className="mx-auto w-full">
        <DrawerHeader>
          <DrawerTitle>
            Are you sure you want to delete this expense?
          </DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col items-start p-5">
          <Button variant="outline" onClick={() => handleDeleteExpense()}>
            Yes
          </Button>
          <DrawerClose className="p-0">
            <Button variant="outline"> No </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ExpenseBox;
