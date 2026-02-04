"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type MapSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function MapSearch({
  value,
  onChange,
  placeholder = "Search places...",
}: MapSearchProps) {
    
  return (
    <div className="relative bg-white w-60 rounded-full">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-8 pr-3 text-sm rounded-full"
      />
    </div>
  );
}
