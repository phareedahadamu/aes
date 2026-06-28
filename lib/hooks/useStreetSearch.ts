import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { useState } from "react";
import {
  getStreetsSearched,
  TStreamlinedStreet,
} from "../dal/service-areas/streets/getStreets";
import { PAGE_LIMITS } from "../constants/general";

export function useStreetSearch({ wardId }: { wardId: string }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const query = useInfiniteQuery({
    queryKey: ["customers-search", debouncedSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await getStreetsSearched({
        searchQuery: debouncedSearch.length > 0 ? debouncedSearch : undefined,
        page: pageParam,
        limit: PAGE_LIMITS.LG,
        wardId,
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
  const streets = query.data?.pages
    ? query.data?.pages.flatMap(
        (page) => page?.data?.streets ?? ([] as TStreamlinedStreet[]),
      )
    : ([] as TStreamlinedStreet[]);

  return {
    search,
    setSearch,
    streets,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
