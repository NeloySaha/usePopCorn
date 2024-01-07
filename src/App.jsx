import { useEffect, useState } from "react";
import "./index.css";
import { Navbar } from "./components/Navbar";
import { Main } from "./components/Main";

import { Search } from "./components/Search";
import { ResultAmount } from "./components/ResultAmount";

import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { WatchList } from "./components/WatchList";
import { WatchedSummary } from "./components/WatchedSummary";

import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { SelectedMovie } from "./components/SelectedMovie";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(
    JSON.parse(localStorage.getItem("watchList")) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  const handleWatchList = (movie) => {
    setWatched((prevWatched) => {
      const movieAlreadyExists = prevWatched.some(
        (oldMovie) => oldMovie.imdbID === movie.imdbID
      );

      if (movieAlreadyExists) return prevWatched;

      return [...prevWatched, movie];
    });

    setSelectedId(null);
  };

  const handleRemoveMovie = (id) => {
    setWatched((prevWatched) => {
      const newFilteredWatched = prevWatched.filter(
        (movie) => movie.imdbID !== id
      );

      return newFilteredWatched;
    });
  };

  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watched));
  }, [watched]);

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

    setSelectedId(null);
    getMovieData(controller);

    return () => {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const callback = (e) => {
      e.code === "Escape" ? setSelectedId(null) : null;
    };

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, []);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <ResultAmount movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={setSelectedId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseMovie={() => setSelectedId(null)}
              addToWatch={handleWatchList}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchList watched={watched} removeMovie={handleRemoveMovie} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
