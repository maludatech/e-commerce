"use client";

import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("Error");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 text-center">
      <Image
        src="/assets/icons/logo.svg"
        alt="logo"
        width={64}
        height={64}
        priority
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <h1 className="text-3xl font-bold">{t("Error")}</h1>
      <p className="max-w-md text-destructive">{error.message}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => reset()}>
          {t("Try again")}
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
        >
          {t("Back To Home")}
        </Button>
      </div>
    </div>
  );
}
