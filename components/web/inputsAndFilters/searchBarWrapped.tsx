import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";
import SearchBar from "./searchBar";
import { Suspense } from "react";
export default function SearchBarWrapped({
  placeholder,
}: {
  placeholder: string;
}) {
  return (
    <Suspense
      fallback={
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder={placeholder} disabled />
          <InputGroupAddon>
            <Loader2 className="animate-spin" />
          </InputGroupAddon>
        </InputGroup>
      }
    >
      <SearchBar placeholder={placeholder} />
    </Suspense>
  );
}
