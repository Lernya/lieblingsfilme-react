import React, { useState, useEffect } from "react";
import JournalCard from "../components/JournalCard";

const Journal = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favorites);
  };

  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const saveNote = (id, note) => {
    const updatedFavorites = favorites.map((movie) =>
      movie.id === id ? { ...movie, note } : movie
    );
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {favorites.map((movie, index) => (
        <JournalCard
          key={index}
          movie={movie}
          onRemoveFromFavorites={removeFromFavorites}
          onSaveNote={saveNote}
        />
      ))}
    </div>
  );
};

export default Journal;
