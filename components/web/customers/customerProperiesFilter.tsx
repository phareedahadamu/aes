"use client";
import { useSearchParams } from "next/navigation";
import FilterCommand from "../inputsAndFilters/filterCommand";
import { FilterGroup } from "@/lib/types/general";
export default function CustomerPropertiesFilter() {
  const searchParams = useSearchParams();
  const isActiveParam = searchParams.get("isActive");
  const isActive =
    isActiveParam === "true"
      ? true
      : isActiveParam === "false"
        ? false
        : undefined;

  const filters: FilterGroup[] = [
    {
      group: "Status",
      items: [
        {
          name: "Active",
          value: "true",
          active: typeof isActive === "boolean" && isActive,
        },
        {
          name: "Disabled",
          value: "false",
          active: typeof isActive === "boolean" && !isActive,
        },
      ],
      param: "isActive",
      allTag: "All Wards",
    },
  ];

  return <FilterCommand filters={filters} />;
}
