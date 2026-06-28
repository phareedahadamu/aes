import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { useState } from "react";
import {
  getWardsSearched,
  TStreamLinedWard,
} from "../dal/service-areas/getServiceAreas";
import { PAGE_LIMITS } from "../constants/general";

export function useWardSearch() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  console.log(debouncedSearch);
  const query = useInfiniteQuery({
    queryKey: ["wards-search", debouncedSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await getWardsSearched({
        searchQuery: debouncedSearch.length > 0 ? debouncedSearch : undefined,
        page: pageParam,
        limit: PAGE_LIMITS.LG,
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
  const wards = query.data?.pages
    ? query.data?.pages.flatMap(
        (page) => page?.data?.wards ?? ([] as TStreamLinedWard[]),
      )
    : ([] as TStreamLinedWard[]);

  return {
    search,
    setSearch,
    wards,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
