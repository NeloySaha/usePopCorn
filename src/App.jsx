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
import { useMovies } from "./customHooks/useMovies";
import { useLocalStorageState } from "./customHooks/useLocalStorageState";
import { useKey } from "./customHooks/useKey";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, setSelectedId);
  const [watched, setWatched] = useLocalStorageState([], "watchList");

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

  useKey("Escape", setSelectedId);

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
              key={selectedId}
              selectedId={selectedId}
              onCloseMovie={() => setSelectedId(null)}
              addToWatch={handleWatchList}
              watched={watched}
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
