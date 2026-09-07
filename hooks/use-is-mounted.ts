import { useEffect, useState } from "react";

function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag, cannot cascade
    setIsMounted(true);
  }, []);

  return isMounted;
}

export default useIsMounted;
