"use client";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { normalizeText } from "@/lib/utils";
import dynamic from "next/dynamic";
import StaffTab from "./staffTab";
import { Tab } from "@/lib/types/general";
import useGetSearchParams from "@/lib/hooks/useGetSearchParams";

const InvitationsTab = dynamic(() => import("./invitationsTab"));
export default function StaffAndInvitations() {
  const {
    search,
    role,
    page,
    isActive,
    isUsed,
    isExpired,
    setActiveTab,
    activeTab,
    limit,
  } = useGetSearchParams();
  const emailQuery = search;

  const tabTriggerCompmnents = Object.values(Tab).map((tab) => {
    const title = normalizeText(tab);
    return (
      <TabsTrigger key={tab} value={tab}>
        {title}
      </TabsTrigger>
    );
  });
  const tabs: Record<Tab, React.ReactNode> = {
    [Tab.STAFF]: (
      <StaffTab
        page={page}
        emailQuery={emailQuery}
        role={role}
        isActive={isActive}
        limit={limit}
      />
    ),
    [Tab.INVITATIONS]: (
      <InvitationsTab
        page={page}
        emailQuery={emailQuery}
        isUsed={isUsed}
        isExpired={isExpired}
        limit={limit}
      />
    ),
  };
  const tabComponents = Object.entries(tabs).map(([key, component]) => (
    <TabsContent key={key} value={key}>
      {component}
    </TabsContent>
  ));
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="gap-x-3!">
          {tabTriggerCompmnents}
        </TabsList>
        {tabComponents}
      </Tabs>
    </>
  );
}
