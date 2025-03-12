import { useState, useEffect, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Pill } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandSeparator } from "./ui/command";
import { cn } from "@/lib/utils";
import { CommandItem } from "cmdk";

export default function Dropdown({ Menus, onSelect, selected }) {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Memoize formatted menu items to prevent unnecessary re-renders
  const formattedMenus = useMemo(
    () => Menus.map((item) => ({ label: item.name, value: item._id })),
    [Menus]
  );

  useEffect(() => {
    if (selected) {
      const selectedMenuB = formattedMenus.find((menu) => menu.value === selected);
      setSelectedMenu(selectedMenuB || null);
    }
  }, [selected, formattedMenus]);

  const onMenuSelect = (menu) => {
    setOpen(false); // Close the popover
    setSelectedMenu(menu); // Set the selected menu object
    onSelect(menu.value); // Call onSelect with the menu ID
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="dropdown"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Menu"
          className="w-[210px] flex items-center justify-between "
        >
          {selectedMenu ? selectedMenu.label : "Select a Menu"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Menu..." />
            <CommandEmpty>No Menu found.</CommandEmpty>
            <CommandGroup heading="Menus">
              {formattedMenus.map((menu) => (
                <CommandItem
                  key={menu.value}
                  onSelect={() => onMenuSelect(menu)}
                  className="flex items-center p-2 text-sm cursor-pointer"
                >
                  <Pill className="mr-2 h-4 w-4" />
                  {menu.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedMenu?.value === menu.value ? "opacity-100" : "opacity-0"
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
