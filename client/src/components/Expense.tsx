import { useState } from "react";
import { Expense } from "@/utils/types"
import { PiNotePencil, PiTrash } from "react-icons/pi";


const ExpenseBox = ({ expense_name, price, quantity, total }: Expense) => {
  const [expenseName_, setExpenseName] = useState("")
  const [price_, setPrice] = useState("")
  const [quantity_, setQuantity] = useState("")
  const [total_, setTotal] = useState("")

  const handleEditExpense = () => {
    console.log("edit this.. this is edit")
  }

  const handleDeleteExpense = () => {
    console.log("edit this.. this is delete")
  }

  return (
    <div className="w-364 p-3 border-2 border-black flex-col">
      <div className="flex justify-evenly">
      <h1 className="justify-start">{expenseName_}title</h1>
      <button
      onClick={handleEditExpense}>
        <PiNotePencil 
        size={30} 
        className=""
        />
      </button>
      </div>
      <div>
        <div className="flex">{price_}100
        <div className="flex">{quantity_}x 10</div>
        </div>
        
      </div>  
      
      <div className="flex justify-evenly">{total_}1000
      <button onClick={handleDeleteExpense}>
      <PiTrash
        size={30}
        />
        </button>
      </div>
    </div>
  )
}

export default ExpenseBox;