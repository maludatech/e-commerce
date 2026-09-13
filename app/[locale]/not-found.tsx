"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("NotFound");
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
      <h1 className="text-3xl font-bold">{t("Title")}</h1>
      <p className="max-w-md text-muted-foreground">{t("Description")}</p>
      <Button
        variant="outline"
        onClick={() => (window.location.href = "/")}
      >
        {t("Back To Home")}
      </Button>
    </div>
  );
}
