import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getAddresses } from "@/lib/actions/address.actions";
import AddressesClient from "./addresses-client";

const PAGE_TITLE = "Addresses";
export const metadata: Metadata = {
  title: PAGE_TITLE,
};

export default async function AddressesPage() {
  const session = await auth();
  if (!session) redirect("/sign-in?callbackUrl=/account/addresses");

  const addresses = await getAddresses();

  return (
    <div className="mb-24">
      <div className="flex gap-2">
        <Link href="/account">Your Account</Link>
        <span>›</span>
        <span>{PAGE_TITLE}</span>
      </div>
      <h1 className="h1-bold py-4">{PAGE_TITLE}</h1>
      <AddressesClient addresses={addresses} />
    </div>
  );
}
