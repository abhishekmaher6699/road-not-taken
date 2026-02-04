"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Mode = "view" | "add";

type ModeToggleProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

const ModeToggle = ({ mode, onChange }: ModeToggleProps) => {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => value && onChange(value as Mode)}
      className="rounded-md border bg-white"
    >
      <ToggleGroupItem
        value="view"
        className="
          h-8 px-3 text-sm
          data-[state=on]:bg-gray-200
          data-[state=on]:text-black
          hover:bg-transparent hover:text-inherit
        "
      >
        View
      </ToggleGroupItem>

      <ToggleGroupItem
        value="add"
        className="
          h-8 px-3 text-sm
          data-[state=on]:bg-gray-200
          data-[state=on]:text-black
          hover:bg-transparent hover:text-inherit
        "
      >
        Add
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ModeToggle;
