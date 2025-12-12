import { getSubscriptionEntitlement } from "@/actions/user";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const { data } = await getSubscriptionEntitlement();

  if (!data?.entitlement) {
    // redirect(`/billing/${combinedSlug(name)}`);
    // redirect(`/dashboard/${combinedSlug(data?.profileName!)}`);
    redirect(`/dashboard/${combinedSlug(data?.profileName!)}`);
  }

  redirect(`/dashboard/${combinedSlug(data?.profileName!)}`);
};

export default DashboardPage;
