// import { useState } from "react";
import { Expense } from "@/utils/types"
import { useMutation } from "@tanstack/react-query";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,

} from "@/components/ui/drawer"
// import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";


const ExpenseBox = ({ expense_name, price, quantity, total }: Expense) => {
  
  const {mutate: handleDeleteExpense} = useMutation ({
    mutationFn: async() => {}
  })
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
      
      <div className="flex justify-evenly">{total}1000
      <button onClick={ () => 
        handleDeleteExpense()
      }>
      <Drawer>
        <DrawerTrigger>
          <PiTrash
          size={30}
          />
        </DrawerTrigger >
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
