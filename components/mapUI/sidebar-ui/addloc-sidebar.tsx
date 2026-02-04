"use client"

import { Button } from "@/components/ui/button"

const AddLocSidebar = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="absolute lg:top-0 lg:left-0 lg:h-full h-[75%] bottom-0 lg:w-[40%] w-full bg-gray-100 shadow-lg z-400">
        <div className="relative h-full w-full overflow-hidden z-400">
            <div className="w-full justify-end top-2 right-2 lg:p-2 flex absolute">
                  <Button className=""
                    onClick={onClose}
                  >Close</Button>                
            </div>

            <div className=" bg-gray-100 h-full w-full">

            </div>
        </div>
    </div>
  )
}

export default AddLocSidebar