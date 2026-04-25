"use client";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { normalizeText } from "@/lib/utils";
import { useState } from "react";

enum Tab {
  STAFF = "staff",
  INVITATIONS = "invitations",
}
export default function StaffAndInvitations() {
  const [activeTab, setActiveTab] = useState(Tab.STAFF);

  const tabTriggerCompmnents = Object.values(Tab).map((tab) => {
    const title = normalizeText(tab);
    return (
      <TabsTrigger key={tab} value={tab}>
        {title}
      </TabsTrigger>
    );
  });
  const tabs: Record<Tab, React.ReactNode> = {
    [Tab.STAFF]: <></>,
    [Tab.INVITATIONS]: <></>,
  };
  const tabComponents = Object.entries(tabs).map(([key, component]) => (
    <TabsContent key={key} value={key}>
      {component}
    </TabsContent>
  ));
  return (
    <>
      <Tabs defaultValue={Tab.STAFF} onValueChange={setActiveTab}>
        <TabsList>{tabTriggerCompmnents}</TabsList>
        {tabComponents}
      </Tabs>
    </>
  );
}
