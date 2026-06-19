"use client";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { debounce } from "@/lib/utils";
export default function SearchBar({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(
    searchParams.get("search") ?? "",
  );
  const debouncedUpdateUrl = useMemo(() => {
    return debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);
  }, [pathname, router, searchParams]);

  const handleUpdateSearchQuery = (newValue: string) => {
    setInputValue(newValue);
    debouncedUpdateUrl(newValue);
  };
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput
        placeholder={placeholder}
        type="text"
        value={inputValue}
        onChange={(e) => handleUpdateSearchQuery(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
