/* eslint-disable react/prop-types */
import { Movie } from "./Movie";

export const MovieList = ({ movies, onSelectMovie }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => {
        const props = {
          movie,
          onSelectMovie,
        };
        return <Movie key={movie.imdbID} {...props} />;
      })}
    </ul>
  );
};
