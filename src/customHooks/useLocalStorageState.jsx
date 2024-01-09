import { useEffect, useState } from "react";

export const useLocalStorageState = (initialState, key) => {
  // only called on initial render
  // must be a pure function, shouldn't take any argument
  // whenever there's computation, callback should be used
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
