import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<
  RPNInput.Props<React.InputHTMLAttributes<HTMLInputElement>>,
  "onChange" | "value"
> {
  value?: string;
  onChange?: (value: string) => void;
}

export const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, value, onChange, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn(
        "flex rounded-md shadow-sm border border-input bg-background",
        className,
      )}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      placeholder={props.placeholder || "Enter phone number"}
      value={value}
      onChange={(v) => onChange?.(v || "")}
      {...props}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

// Standard input block styled to match shadcn forms
const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      "rounded-l-none border-0 focus-visible:ring-0 shadow-none",
      className,
    )}
    ref={ref}
    {...props}
  />
));
InputComponent.displayName = "InputComponent";

// Custom shadcn popover for the country selector dropdown
type CountrySelectProps = {
  disabled?: boolean;
  value?: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { value?: RPNInput.Country; label: string }[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button type="button" variant="ghost" disabled={disabled}>
            <FlagComponent country={value} countryName={value} />
            <ChevronsUpDown
              className={cn(
                "-mr-2 h-4 w-4 opacity-50",
                disabled ? "hidden" : "block",
              )}
            />
          </Button>
        }
      />
      <PopoverContent className="w-75 p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.value)
                .map((option) => (
                  <CommandItem
                    className="gap-2"
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value!);
                    }}
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                    />
                    <span className="flex-1 text-sm">{option.label}</span>
                    {option.value && (
                      <span className="text-foreground/50 text-sm">
                        +{RPNInput.getCountryCallingCode(option.value)}
                      </span>
                    )}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        option.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({
  country,
  countryName,
}: {
  country?: RPNInput.Country;
  countryName?: string;
}) => {
  const Flag = flags[country!];
  return (
    <span className=" flex h-4 w-6 overflow-hidden rounded-sm text-xs">
      {Flag ? (
        <Flag title={countryName ?? ""} />
      ) : (
        <span className="m-auto text-[10px]">🌐</span>
      )}
    </span>
  );
};
