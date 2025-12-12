import { getSubscriptionEntitlement } from "@/actions/user";
import TopNavigationBar from "@/components/navigation/top-navigation-bar";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

const DashboardSessionLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data } = await getSubscriptionEntitlement();
  if (data?.entitlement) {
    // redirect(`/billing/${data.profileName}`);
    redirect(`/dashboard/${data.profileName}`);
    // redirect(`/dashboard`);
  }
  return (
    <div className="grid grid-cols-1">
      <TopNavigationBar />
      {children}
    </div>
  );
};

export default DashboardSessionLayout;
