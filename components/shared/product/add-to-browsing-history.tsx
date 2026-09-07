"use client";
import useBrowsingHistory from "@/hooks/use-browsing-history";
import { useEffect } from "react";

export default function AddToBrowsingHistory({
  id,
  category,
}: {
  id: string;
  category: string;
}) {
  const { addItem } = useBrowsingHistory();
  useEffect(() => {
    addItem({ id, category });
    // addItem is recreated every render by the store hook; only re-run when
    // the viewed product actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, category]);
  return null;
}
