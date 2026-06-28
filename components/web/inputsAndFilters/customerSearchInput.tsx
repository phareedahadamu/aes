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
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";
import { StreamlinedCustomerType } from "@/lib/dal/customers/getCustomers";
import AddEditCustomerModal from "../customers/addEditCustomerModal";

export default function CustomerSearchInput({
  value,
  setValue,
  setFieldValue,
}: {
  value: StreamlinedCustomerType | null;
  setValue: Dispatch<SetStateAction<StreamlinedCustomerType | null>>;
  setFieldValue: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    search,
    setSearch,
    customers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useCustomerSearch();
  return (
    <Combobox
      itemToStringLabel={(val) => {
        return val.name;
      }}
      filter={undefined}
      value={value}
      onValueChange={(val) => {
        setValue(val);
        setFieldValue(val ? val.id : "");
      }}
      inputValue={search}
      items={customers}
      onInputValueChange={setSearch}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxInput placeholder="Search by name or email" showTrigger={false}>
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
              No Customers found
              <AddEditCustomerModal action="add" variant="link" />
            </ComboboxEmpty>
          )}

          {customers &&
            customers.map((item) => (
              <ComboboxItem key={item.id} value={item}>
                <Item>
                  <ItemContent>
                    <ItemTitle>{item.name}</ItemTitle>{" "}
                    <ItemDescription>
                      {item.email || "-"} | {item.phoneNo}
                    </ItemDescription>
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
