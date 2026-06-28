"use client";

import { Search, Loader2 } from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Item, ItemContent, ItemTitle, ItemDescription } from "../../ui/item";
import { InputGroupAddon } from "@/components/ui/input-group";
import { useWardSearch } from "@/lib/hooks/useWardSearch";
import { TStreamLinedWard } from "@/lib/dal/service-areas/getServiceAreas";
import AddEditWardModal from "../service-areas/addEditWardModal";

export default function WardSearchInput({
  value,
  setValue,
  setFieldValue,
}: {
  value: TStreamLinedWard | null;
  setValue: Dispatch<SetStateAction<TStreamLinedWard | null>>;
  setFieldValue: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    search,
    setSearch,
    wards,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useWardSearch();
  return (
    <Combobox
      itemToStringLabel={(val) => {
        return val.name;
      }}
      itemToStringValue={(val) => {
        return val.id;
      }}
      filter={undefined}
      value={value}
      onValueChange={(val) => {
        setValue(val);
        setFieldValue(val ? val.id : "");
      }}
      inputValue={search}
      items={wards}
      onInputValueChange={setSearch}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxInput placeholder="Search by code or name" showTrigger={false}>
        <InputGroupAddon>
          {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
        </InputGroupAddon>
      </ComboboxInput>

      <ComboboxContent>
        <ComboboxList>
          {isLoading ? (
            <ComboboxEmpty className="items-center flex flex-col">
              <Loader2 className="animate-spin" />
            </ComboboxEmpty>
          ) : (
            <ComboboxEmpty className="items-center flex flex-col gap-2">
              No Wards found
              <AddEditWardModal action="add" variant="link" />
            </ComboboxEmpty>
          )}

          {wards &&
            wards.map((item) => (
              <ComboboxItem key={item.id} value={item}>
                <Item>
                  <ItemContent>
                    <ItemTitle>{item.name}</ItemTitle>{" "}
                    <ItemDescription>{item.code}</ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            ))}
        </ComboboxList>
        {hasNextPage && (
          <button
            className=" text-lg enabled:hover:bg-accent w-full  py-2 rounded-mid disabled:opacity-60 text-muted-foreground flex itels-center justify-enter gap-2"
            disabled={isFetchingNextPage}
            onClick={() => {
              fetchNextPage();
            }}
          >
            {isFetchingNextPage && (
              <Loader2 className="animate-spin text-inherit" />
            )}
            Load more
          </button>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
