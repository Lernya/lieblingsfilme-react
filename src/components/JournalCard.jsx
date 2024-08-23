import React, { useState } from "react";

const JournalCard = ({ movie, onRemoveFromFavorites, onSaveNote }) => {
  const [note, setNote] = useState(movie.note || "");
  const IMG_URL = "https://image.tmdb.org/t/p/w500";

  const handleSaveNote = () => {
    onSaveNote(movie.id, note);
  };

  return (
    <div className="movie bg-white rounded-lg shadow-lg overflow-hidden relative">
      <button
        className="remove-favorite absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-lg flex items-center justify-center"
        onClick={() => onRemoveFromFavorites(movie.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <img
        src={`${IMG_URL}${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-96 object-cover h-64 mb-4"
      />
      <div className="flex justify-between p-4 items-center mb-2">
        <h3 className="text-lg font-bold text-black">{movie.title}</h3>
        <span className="px-2 py-1 rounded-lg">{movie.vote_average}</span>
      </div>
      <p className="text-gray-700 p-4">
        {movie.overview.length > 30
          ? movie.overview.substring(0, 50) + "..."
          : movie.overview}
        <a href="#" className="underline text-blue-500">
          Read more
        </a>
      </p>
      <div className="flex flex-col p-4 items-end">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          placeholder="Add your notes here..."
        />
        <button
          className="save-note bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSaveNote}
        >
          Save Note
        </button>
      </div>
    </div>
  );
};

export default JournalCard;
