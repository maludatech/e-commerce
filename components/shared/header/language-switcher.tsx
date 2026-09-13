"use client";

import * as React from "react";
import * as FlagIcons from "country-flag-icons/react/3x2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { i18n } from "@/i18n-config";
import { ChevronDownIcon } from "lucide-react";

export default function LanguageSwitcher() {
  const { locales } = i18n;
  const locale = useLocale();
  const pathname = usePathname();

  const currentFlagCode = locales.find((l) => l.code === locale)?.icon;
  const CurrentFlag = currentFlagCode
    ? FlagIcons[currentFlagCode as keyof typeof FlagIcons]
    : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-button h-[41px]">
        <div className="flex items-center gap-1">
          {CurrentFlag && <CurrentFlag className="w-5 rounded-xs" />}
          {locale.toUpperCase().slice(0, 2)}
          <ChevronDownIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale}>
          {locales.map((c) => {
            const Flag = FlagIcons[c.icon as keyof typeof FlagIcons];
            return (
              <DropdownMenuRadioItem key={c.name} value={c.code}>
                <Link
                  className="w-full flex items-center gap-2"
                  href={pathname}
                  locale={c.code}
                >
                  {Flag && <Flag className="w-5 rounded-xs" />} {c.name}
                </Link>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
