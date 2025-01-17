"use client";

import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { Button } from "../button";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-black text-white underline-link">
      <div className="w-full">
        <Button
          variant={"ghost"}
          className="bg-gray-800 w-full rounded-none"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          Back to top
        </Button>
      </div>
      <div className="p-4">
        <div className="flex justify-center gap-3 text-sm">
          <Link href={"/page/conditions-of-use"}>Conditions of use</Link>
          <Link href={"/page/privacy-policy"}>Privacy Notice</Link>
          <Link href={"/page/help"}>Help</Link>
        </div>
        <div className="flex justify-center text-sm">
          <p>
            © 2000 - ${currentYear}, {APP_NAME}, Inc. or its affiliates
          </p>
        </div>
        <div className="mt-8 flex justify-center text-sm text-gray-400">
          No.102 Odim street, Nsukka, Zip 422111 | +2348163887385
        </div>
      </div>
    </footer>
  );
}
