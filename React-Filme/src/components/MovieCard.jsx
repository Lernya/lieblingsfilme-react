import React from "react";

const MovieCard = ({ movie, onAddToFavorites }) => {
  const { title, poster_path, vote_average, overview, id } = movie;
  const IMG_URL = "https://image.tmdb.org/t/p/w500";

  const getColor = (vote) => {
    if (vote >= 7) return "green";
    if (vote >= 5) return "orange";
    return "red";
  };

  return (
    <div className="movie">
      <img src={`${IMG_URL}${poster_path}`} alt={title} />
      <button
        className="absolute top-2 right-2 bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center"
        onClick={() => onAddToFavorites(movie)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
      <div className="movie-info">
        <h3>{title}</h3>
        <span className={getColor(vote_average)}> {vote_average}</span>
      </div>
      <div className="overview">
        <h3>Overview</h3>
        {overview}
      </div>
    </div>
  );
};

export default MovieCard;
