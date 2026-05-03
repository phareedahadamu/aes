"use client";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandDialog,
} from "@/components/ui/command";
import { Button } from "../../ui/button";
import { ListFilter, Check } from "lucide-react";
import { useState } from "react";
import { FilterGroup } from "@/lib/types/general";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function FilterCommand({ filters }: { filters: FilterGroup[] }) {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const groupComponents = filters.flatMap((group, idx) => {
    const component = (
      <CommandGroup heading={group.group} key={`group-${idx}`}>
        {group.items.map((item, index) => {
          const itemComponent = (
            <CommandItem
              key={index}
              onSelect={() => handleSelect(group.param, item.value)}
              className={`hover:bg-primary-foreground cursor-pointer ${item.active ? "text-primary" : ""}`}
            >
              {item.name}
              {item.active && <Check className="text-primary size-4" />}
            </CommandItem>
          );
          return index === 0
            ? [
                <CommandItem
                  key={"all-" + index + idx}
                  onSelect={() => handleSelect(group.param, "all")}
                  className={`hover:bg-primary-foreground cursor-pointer ${
                    !group.items.some((item) => item.active === true)
                      ? "text-primary"
                      : ""
                  }`}
                >
                  {`All (${group.group})`}{" "}
                  {!group.items.some((item) => item.active === true) && (
                    <Check className="text-primary size-4" />
                  )}
                </CommandItem>,
                itemComponent,
              ]
            : [itemComponent];
        })}
      </CommandGroup>
    );
    return idx < filters.length - 1
      ? [component, <CommandSeparator key={`sep-${idx}`} />]
      : [component];
  });
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-fit p-3! text-chart-2 text-lg!"
      >
        <ListFilter className="text-chart-2 size-4" />
        Filters
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandList>{groupComponents}</CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
