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
// import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";

const ExpenseBox = ({ expense_name, price, quantity, total }: Expense) => {
  const { mutate: handleDeleteExpense } = useMutation({
    mutationFn: async () => {},
  });
  const handleEditExpense = () => {
    console.log("edit this.. this is edit");
  };

  return (
    <div className="flex h-auto flex-row flex-nowrap justify-between border-2 border-black p-3">
      <div className="flex flex-col">
        <h1 className="flex h-auto truncate text-wrap">
          {expense_name}
          titlejdahfiauhsdifuadskhadjbdkjhgfkasdgfladsfhdklsafhadklsfhjldafhkjkldsafhjlkfbadosfhiodjsdguastdaysfdasfdyafdsafhoadjhadkfjk
        </h1>
        <div>
          <div className="flex">
            {price}100
            <div className="flex">{quantity}1000</div>
          </div>
        </div>
        <div>{total}10000</div>
      </div>

      <div className="flex flex-col items-end">
        <button className="" onClick={handleEditExpense}>
          <PiNotePencil size={30} className="wx-32" />
        </button>
        <button onClick={() => handleDeleteExpense()} className="p-0">
          <Drawer>
            <DrawerTrigger>
              <PiTrash size={30} className="m-0 p-0" />
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
                  <Button variant="outline"> No </Button>
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
