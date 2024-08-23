import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ movies, onAddToFavorites }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onAddToFavorites={onAddToFavorites}
        />
      ))}
    </div>
  );
};

export default MovieList;
