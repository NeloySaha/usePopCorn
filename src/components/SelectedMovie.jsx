/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { StarRating } from "./StarRating";
import { Loader } from "./Loader";

export const SelectedMovie = ({
  selectedId,
  onCloseMovie,
  addToWatch,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    hour,
    minutes,
    imdbID,
  } = movie;

  const alreadyWatched = watched.some(
    (watchedMovie) => watchedMovie.imdbID === selectedId
  );

  useEffect(() => {
    if (alreadyWatched) {
      const watchedMovieObj = watched.find(
        (watchedMovie) => watchedMovie.imdbID === selectedId
      );

      setUserRating(watchedMovieObj.userRating);
    }
  }, [alreadyWatched]);

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL_PREFIX}&i=${selectedId}`
        );

        const data = await res.json();

        const RuntimeData = +data.Runtime.split(" ").at(0);
        const hour = Math.floor(RuntimeData / 60);

        setMovie({ ...data, hour, minutes: RuntimeData - hour * 60 });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  useEffect(() => {
    userRating > 0 && countRef.current++;

    console.log(countRef.current);
  }, [userRating]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {`${hour}h ${minutes}m`}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {alreadyWatched ? (
                <p>You have rated this movie {userRating} ⭐️</p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={() => {
                        addToWatch({
                          imdbID,
                          Title: title,
                          Year: released,
                          Poster: poster,
                          runtime: +runtime.split(" ").at(0),
                          imdbRating,
                          userRating,
                        });
                      }}
                    >
                      + Add to List
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};
