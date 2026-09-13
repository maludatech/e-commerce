import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import PasswordForm from "./password-form";

const PAGE_TITLE = "Change Your Password";
export const metadata: Metadata = {
  title: PAGE_TITLE,
};

export default async function ChangePasswordPage() {
  const session = await auth();
  if (!session) redirect("/sign-in?callbackUrl=/account/manage/password");

  return (
    <div className="mb-24">
      <div className="flex gap-2">
        <Link href="/account">Your Account</Link>
        <span>›</span>
        <Link href="/account/manage">Login & Security</Link>
        <span>›</span>
        <span>{PAGE_TITLE}</span>
      </div>
      <h1 className="h1-bold py-4">{PAGE_TITLE}</h1>
      <Card className="max-w-2xl">
        <CardContent className="p-4">
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
