import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandList, CommandSeparator } from "./ui/command";
import { cn } from "@/lib/utils";
import { CommandItem } from "cmdk";

// The data for Addis Ababa subcities and parts
const addisAbabaData = {
  "Addis Ababa": {
    "subcities": {
      "Bole": ["CMC", "Gerji", "Goro", "Bisrate Gabriel", "Airport","Ras Desta Damtew St"],
      "Kirkos": ["Kazanchis", "Mexico", "Wollo Sefer"],
      "Lideta": ["Merkato", "Addis Ketema", "Taitu"],
      "Arada": ["Piazza", "Sidist Kilo", "Shiro Meda"],
      "Yeka": ["Megenagna", "Summit", "Yerer"],
      "Nifas Silk-Lafto": ["Jemo", "Lafto", "Gofa"],
      "Akaky Kaliti": ["Akaky", "Kaliti"],
      "Kolfe Keranyo": ["Kolfe", "Jemo"],
      "Addis Ketema": ["Merkato", "Tekle Haimanot"],
      "Gulele": ["Entoto", "Shiromeda"]
    }
  }
};

export default function LocationDropdown({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Flatten the list of locations (subcity + parts)
  const locationOptions = Object.keys(addisAbabaData["Addis Ababa"].subcities).flatMap(
    (subcity) => {
      return addisAbabaData["Addis Ababa"].subcities[subcity].map((part) => ({
        label: `${subcity} - ${part}`,
        value: { subcity, part }
      }));
    }
  );

  const onLocationSelect = (location) => {
    setOpen(false); // Close the popover
    setSelectedLocation(location); // Set the selected location
    onSelect(location.value); // Call onSelect with the location value (subcity and part)
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a location"
          className="w-[200px] items-center flex justify-between gap-2 border-foregorund text-gray-700"
        >
          {selectedLocation ? selectedLocation.label : "Select a Location"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup heading="Locations">
              {locationOptions.map((location) => (
                <CommandItem
                  key={location.value.subcity + location.value.part}
                  onSelect={() => onLocationSelect(location)}
                  className="flex items-center p-2 text-sm cursor-pointer"
                >
                  {location.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedLocation?.value.subcity === location.value.subcity &&
                        selectedLocation?.value.part === location.value.part
                        ? "opacity-100"
                        : "opacity-0"
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
