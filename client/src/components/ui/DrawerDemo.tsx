import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface DrawerDemoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DrawerDemo({ open, setOpen }: DrawerDemoProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="w-[40rem]">
        <DrawerHeader>
          <DrawerTitle>Same Budget?</DrawerTitle>
          <DrawerDescription>
            Do you want to use the same budget for each category this week?
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex gap-6 p-4">
          <Button variant="outline">No</Button>
          <Button variant="outline">Yes</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
