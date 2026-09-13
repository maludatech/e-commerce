import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { getSetting } from "@/lib/actions/setting.actions";

export const metadata: Metadata = {
  title: "Under Maintenance",
};

export default async function MaintenancePage() {
  const {
    common: { isMaintenanceMode },
    site,
  } = await getSetting();

  // Nothing to see here once maintenance mode is off — send visitors home
  // instead of leaving a dead page reachable forever.
  if (!isMaintenanceMode) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 text-center">
      <Image
        src="/assets/icons/logo.svg"
        alt={`${site.name} logo`}
        width={64}
        height={64}
        priority
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <h1 className="text-3xl font-bold">We&apos;ll be back soon</h1>
      <p className="max-w-md text-muted-foreground">
        {site.name} is currently undergoing scheduled maintenance. We&apos;re
        working to get things back to normal as quickly as possible. Thanks
        for your patience.
      </p>
      <p className="text-sm text-muted-foreground">
        Need help in the meantime? Reach us at{" "}
        <a className="link" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>
    </div>
  );
}
