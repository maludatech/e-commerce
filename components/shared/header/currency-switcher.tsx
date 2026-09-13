"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useSettingStore from "@/hooks/use-setting-store";
import { setCurrencyOnServer } from "@/lib/actions/setting.actions";

export default function CurrencySwitcher() {
  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore();

  const handleCurrencyChange = async (newCurrency: string) => {
    await setCurrencyOnServer(newCurrency);
    setCurrency(newCurrency);
  };

  const current = availableCurrencies.find((c) => c.code === currency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-button h-[41px]">
        <div className="flex items-center gap-1">
          {current ? `${current.symbol} ${current.code}` : currency}
          <ChevronDownIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Currency</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={handleCurrencyChange}
        >
          {availableCurrencies.map((c) => (
            <DropdownMenuRadioItem key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
