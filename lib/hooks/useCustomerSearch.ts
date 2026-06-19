import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { useState } from "react";
import {
  getCustomersSearched,
  StreamlinedCustomerType,
} from "../dal/customers/getCustomers";

export function useCustomerSearch() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const query = useInfiniteQuery({
    queryKey: ["customers", debouncedSearch],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const response = await getCustomersSearched({
        searchQuery: debouncedSearch,
        page: pageParam,
      });

      if (!response.success) return null;
      return response;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;
      const currentPage = pagination?.currentPage ?? 1;
      const totalPages = pagination?.totalPages ?? 1;

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
  const customers = query.data?.pages.flatMap(
    (page) => page?.data?.customers ?? ([] as StreamlinedCustomerType[]),
  );

  return {
    search,
    setSearch,
    customers,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
