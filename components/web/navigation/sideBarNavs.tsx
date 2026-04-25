"use client";
import { Role } from "@/generated/prisma/enums";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navSections } from "@/lib/constants/appRoutes";

export default function SideBarNavs({ role }: { role: Role }) {
  const pathname = usePathname();
  const filteredSections = navSections
    .filter((group) => group.visibleTo.includes(role))
    .map((section) => {
      return (
        <section key={section.title} className="flex flex-col gap-2 w-full">
          <h2 className="font-medium leading-6">{section.title}</h2>
          <ul className="w-full flex flex-col">
            {section.items
              .filter((navItem) => navItem.visibleTo.includes(role))
              .map((item) => {
                const isActivePath =
                  item.href === "/"
                    ? pathname === "/"
                    : new RegExp(`^${item.href}(/|$)`).test(pathname);
                return (
                  <li key={item.href} className="w-full">
                    <Link
                      href={item.href}
                      className={`flex items-center px-2 py-3 rounded-mid w-full gap-2 font-medium  ${isActivePath ? "text-primary bg-accent" : "text-muted-foreground bg-transparent hover:text-primary"}`}
                    >
                      <item.icon className="text-inherit size-6" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      );
    });
  return <>{filteredSections}</>;
}
