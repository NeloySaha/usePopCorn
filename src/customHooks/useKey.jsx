import { useEffect } from "react";

export const useKey = (key, action) => {
  useEffect(() => {
    const callback = (e) => {
      if (e.code === key) {
        action(null);
      }
    };

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, []);
};
