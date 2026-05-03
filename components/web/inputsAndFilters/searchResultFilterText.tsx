import FilterPills from "./filterPills";
export default function SearchResultFilterText({
  searchQuery,
  filters,
}: {
  searchQuery: string | undefined;
  filters: string[];
}) {
  if (!searchQuery) return null;
  console.log(searchQuery);
  return (
    <div className="w-full flex gap-3 items-center text-base!">
      <p className=" text-chart-3">
        Showing results for{" "}
        <span className="font-semibold">{` "${searchQuery}"`}</span>
      </p>
      <div className="flex gap-1.5">
        <FilterPills filters={filters} />
      </div>
    </div>
  );
}
