import { useEffect, useState } from "react";

export const useHeight = (): number => {
  const getHeight = () =>
    typeof window !== "undefined" ? window.innerHeight : 0;

  const [height, setHeight] = useState<number>(getHeight);

  useEffect(() => {
    const handleResize = () => {
      setHeight(getHeight());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return height;
};
