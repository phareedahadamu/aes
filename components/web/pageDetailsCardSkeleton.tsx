export default function PageDetailsCardSkeleton() {
  return (
    <div className="w-full bg-background flex flex-col items-start p-4 rounded-mid gap-4 ">
      <div className="h-6 w-1/4 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-2 w-fit gap-y-1 gap-x-2 ">
        <div className="h-4 w-16 bg-muted rounded col-span-1 animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded col-span-1 animate-pulse" />
        <div className="h-4 w-16 bg-muted rounded col-span-1 animate-pulse" />
        <div className="h-4 w-24 bg-muted rounded col-span-1 animate-pulse" />
        <div className="h-4 w-20 bg-muted rounded col-span-1 animate-pulse" />
        <div className="h-4 w-10 bg-muted rounded col-span-1 animate-pulse" />
      </div>
    </div>
  );
}
