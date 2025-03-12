import { useState, useEffect, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Pill } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandSeparator } from "./ui/command";
import { cn } from "@/lib/utils";
import { CommandItem } from "cmdk";

export default function Dropdown({ categories, onSelect, selected }) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Memoize formatted categories to prevent unnecessary re-renders
  const formattedCategories = useMemo(
    () => categories.map((item) => ({ label: item.name, value: item._id })),
    [categories]
  );

  useEffect(() => {
    if (selected) {
      const selectedCategoryB = formattedCategories.find((category) => category.value === selected);
      setSelectedCategory(selectedCategoryB || null);
    }
  }, [selected, formattedCategories]);

  const onStoreSelect = (category) => {
    setOpen(false); // Close the popover
    setSelectedCategory(category); // Set the selected category object
    onSelect(category.value); // Call onSelect with the category ID
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="dropdown"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Category"
          className="w-[290px] flex items-center justify-between "
        >
          {selectedCategory ? selectedCategory.label : "Select a Category"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Category..." />
            <CommandEmpty>No Category found.</CommandEmpty>
            <CommandGroup heading="Categories">
              {formattedCategories.map((category) => (
                <CommandItem
                  key={category.value}
                  onSelect={() => onStoreSelect(category)}
                  className="flex items-center p-2 text-sm cursor-pointer"
                >
                  <Pill className="mr-2 h-4 w-4" />
                  {category.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCategory?.value === category.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
