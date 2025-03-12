import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

function PriceRangeDropdown({ onSelect }) {
  const [selectedRange, setSelectedRange] = useState("Filter by Price");

  const priceRanges = [
    { label: "Below 10 Birr", value: [0, 10] },
    { label: "10 - 50 Birr", value: [10, 50] },
    { label: "50 - 100 Birr", value: [50, 100] },
    { label: "Above 100 Birr", value: [100, Infinity] },
  ];

  const handleSelect = (range, label) => {
    setSelectedRange(label || "Filter by Price");
    onSelect(range);
    document.activeElement?.blur(); // Ensures the dropdown closes
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[150px] flex justify-start border-foregorund text-gray-700"
        >
          {selectedRange}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {priceRanges.map((range) => (
          <DropdownMenuItem
            key={range.label}
            onClick={() => handleSelect(range.value, range.label)}
          >
            {range.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PriceRangeDropdown;
