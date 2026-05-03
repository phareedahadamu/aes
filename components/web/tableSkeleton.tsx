"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[1, 2, 3, 4, 5].map((item) => (
              <TableHead key={item}>
                <p className="h-4 w-[30%] rounded-full bg-muted-foreground animate-pulse" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableCell key={i}>
                  <p className="h-4! w-[70%] rounded-full bg-muted-foreground! animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
