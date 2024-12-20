import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dispatch, SetStateAction } from "react";

interface WeeklyFilterDropdownProps {
  selectedDay: string;
  setSelectedDay: Dispatch<SetStateAction<string>>;
}

const WeeklyFilterDropdown = ({
  selectedDay,
  setSelectedDay,
}: WeeklyFilterDropdownProps) => {
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-green rounded-3xl text-white hover:bg-[#2f4f4f]">
        Select Day:
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50 rounded-3xl bg-slate-50">
        <DropdownMenuLabel className="border-green bg-green rounded-md border-2 text-white">
          Select a Day
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={selectedDay}
          onValueChange={handleDayChange}
        >
          {[
            "None",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day) => (
            <DropdownMenuRadioItem key={day} value={day}>
              {day}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WeeklyFilterDropdown;
