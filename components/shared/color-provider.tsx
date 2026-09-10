"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import useColorStore from "@/hooks/use-color-store";

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { color, updateCssVariables } = useColorStore(theme);

  React.useEffect(() => {
    updateCssVariables();
    // updateCssVariables is a new function identity every render (not
    // memoized by useColorStore); it always reflects the current theme/color
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, color]);

  return children;
}
