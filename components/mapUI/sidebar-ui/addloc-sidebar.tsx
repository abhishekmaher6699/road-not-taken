"use client";

import { Button } from "@/components/ui/button";
import AddPinForm from "./add-pin-form";
import { useBreakpoint } from "@/hooks/useBreakPoint";

type SidebarProps = {
  previewPin: Latlang | null;
  open: boolean;
  onClose: () => void;
};

type Latlang = {
  lat: number;
  lng: number;
}

const AddLocSidebar = ({ previewPin, open, onClose }: SidebarProps) => {

  const isDesktop = useBreakpoint(1024);

  return (
    <div
      className={`
        fixed z-400 bg-gray-100 shadow-lg
        transition-transform duration-200 ease-out
        lg:top-0 lg:left-0 lg:h-full lg:w-[40%]
        bottom-0 h-[75%] w-full
        pointer-events-auto
        

        ${
          open ? isDesktop ? "translate-x-0" : "translate-y-0" : isDesktop ? "-translate-x-full" : "translate-y-full" 
        }
      `}
    >
      <div className="relative h-full w-full overflow-auto">

        <div className="flex justify-end p-2 lg:p-4">
          <Button onClick={onClose} className="bg-transparent text-black hover:bg-gray-200">X</Button>
        </div>


        <div className="h-full w-full bg-gray-100">
          <AddPinForm previewPin={previewPin} onCancel={onClose}/>
        </div>
      </div>
    </div>
  );
};

export default AddLocSidebar;
