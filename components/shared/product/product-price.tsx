"use client";
import useSettingStore from "@/hooks/use-setting-store";
import { cn, round2 } from "@/lib/utils";
import { useFormatter, useLocale, useTranslations } from "next-intl";

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
}: {
  price: number;
  isDeal?: boolean;
  listPrice?: number;
  className?: string;
  forListing?: boolean;
  plain?: boolean;
}) => {
  const { getCurrency } = useSettingStore();
  const currency = getCurrency();
  const t = useTranslations();
  const locale = useLocale();
  const convertedPrice = round2(currency.convertRate * price);
  const convertedListPrice = round2(currency.convertRate * listPrice);

  const format = useFormatter();
  const discountPercent = Math.round(
    100 - (convertedPrice / convertedListPrice) * 100
  );
  // Use Intl's own part-splitting (not a manual string split) so thousands
  // separators and the decimal mark are correct for every locale/currency,
  // not just small USD amounts.
  const priceParts = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).formatToParts(convertedPrice);
  const intValue = priceParts
    .filter((p) => p.type !== "fraction" && p.type !== "decimal")
    .map((p) => p.value)
    .join("");
  const floatValue = priceParts.find((p) => p.type === "fraction")?.value ?? "00";

  return plain ? (
    format.number(convertedPrice, {
      style: "currency",
      currency: currency.code,
      currencyDisplay: "narrowSymbol",
    })
  ) : convertedListPrice == 0 ? (
    <div className={cn("text-3xl", className)}>
      <span className="text-xs align-super">{currency.symbol}</span>
      {intValue}
      <span className="text-xs align-super">{floatValue}</span>
    </div>
  ) : isDeal ? (
    <div className="space-y-2">
      <div className="flex justify-center items-center gap-2">
        <span className="bg-red-700 rounded-sm p-1 text-white text-sm font-semibold">
          {discountPercent}% {t("Product.Off")}
        </span>
        <span className="text-red-700 text-xs font-bold">
          {t("Product.Limited time deal")}
        </span>
      </div>
      <div
        className={`flex ${forListing && "justify-center"} items-center gap-2`}
      >
        <div className={cn("text-3xl", className)}>
          <span className="text-xs align-super">{currency.symbol}</span>
          {intValue}
          <span className="text-xs align-super">{floatValue}</span>
        </div>
        <div className="text-muted-foreground text-xs py-2">
          {t("Product.Was")}:{" "}
          <span className="line-through">
            {format.number(convertedListPrice, {
              style: "currency",
              currency: currency.code,
              currencyDisplay: "narrowSymbol",
            })}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="">
      <div className="flex justify-center gap-3">
        <div className="text-3xl text-orange-700">-{discountPercent}%</div>
        <div className={cn("text-3xl", className)}>
          <span className="text-xs align-super">{currency.symbol}</span>
          {intValue}
          <span className="text-xs align-super">{floatValue}</span>
        </div>
      </div>
      <div className="text-muted-foreground text-xs py-2">
        {t("Product.List price")}:{" "}
        <span className="line-through">
          {format.number(convertedListPrice, {
            style: "currency",
            currency: currency.code,
            currencyDisplay: "narrowSymbol",
          })}
        </span>
      </div>
    </div>
  );
};

export default ProductPrice;
