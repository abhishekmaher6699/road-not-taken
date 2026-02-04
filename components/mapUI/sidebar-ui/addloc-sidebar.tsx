"use client";

import { Button } from "@/components/ui/button";
import AddPinForm from "./add-pin-form";
import { useBreakpoint } from "@/hooks/useBreakPoint";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const AddLocSidebar = ({ open, onClose }: SidebarProps) => {

  const isDesktop = useBreakpoint(1024);

  return (
    <div
      className={`
        fixed z-[400] bg-gray-100 shadow-lg
        transition-transform duration-200 ease-out
        lg:top-0 lg:left-0 lg:h-full lg:w-[40%]
        bottom-0 h-[75%] w-full
        ${
          open ? isDesktop ? "translate-x-0" : "translate-y-0" : isDesktop ? "-translate-x-full" : "translate-y-full" 
        }
      `}
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-end p-2 lg:p-4">
          <Button onClick={onClose}>Close</Button>
        </div>

        {/* FORM */}
        <div className="h-full w-full bg-gray-100">
          <AddPinForm />
        </div>
      </div>
    </div>
  );
};

export default AddLocSidebar;
