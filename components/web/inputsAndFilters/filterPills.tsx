export default function FilterPills({ filters }: { filters: string[] }) {
  if (FilterPills.length < 1) return null;
  return (
    <>
      {filters.map((filter) => (
        <span
          key={filter}
          className="border-border border py-1 px-1.5 text-sm bg-muted text-muted-foreground font-medium"
        >
          {filter}
        </span>
      ))}
    </>
  );
}
