/* eslint-disable react/prop-types */
import { WatchedMovie } from "./WatchedMovie";

export const WatchList = ({ watched, removeMovie }) => {
  return (
    <ul className="list">
      {watched.map((movie) => {
        const props = {
          movie,
          removeMovie,
        };
        return <WatchedMovie key={movie.imdbID} {...props} />;
      })}
    </ul>
  );
};
