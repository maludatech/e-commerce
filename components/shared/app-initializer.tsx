import React, { useEffect, useState } from "react";
import useSettingStore from "@/hooks/use-setting-store";
import { ClientSetting } from "@/types";

export default function AppInitializer({
  setting,
  children,
}: {
  setting: ClientSetting;
  children: React.ReactNode;
}) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration flag for `setting`
    setRendered(true);
  }, [setting]);
  if (!rendered) {
    useSettingStore.setState({
      setting,
    });
  }

  return children;
}
