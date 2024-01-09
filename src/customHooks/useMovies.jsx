import React, { useEffect, useState } from "react";

export const useMovies = (query, callback) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getMovieData = async (controller) => {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL_PREFIX}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong!");

        const data = await res.json();

        if (data.Response === "False" || query.length === 0)
          throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 2) {
      setMovies([]);
      setError("");
      return;
    }

    const controller = new AbortController();

    callback?.(null);
    getMovieData(controller);

    return () => {
      controller.abort();
    };
  }, [query]);

  return {
    movies,
    error,
    isLoading,
  };
};
