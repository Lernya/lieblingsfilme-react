import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";

// The Home component manages the state and API fetching for displaying movies.
const Home = () => {
  // State to hold the list of movies.
  const [movies, setMovies] = useState([]);
  // State to handle any errors that might occur during the fetch.
  const [error, setError] = useState(null);

  // This useEffect runs once when the component mounts to fetch the initial list of movies.
  useEffect(() => {
    console.log(
      "Component mounted, calling fetchMovies with an empty query to fetch now playing movies."
    );
    fetchMovies(); // Initial fetch for now playing movies
  }, []); // Empty dependency array means this runs once on mount.

  // Function to fetch movies from the API.
  const fetchMovies = async (query = "") => {
    console.log("fetchMovies called with query:", query);
    try {
      // Fetch request to the TMDB API.
      const res = await fetch(
        `https://api.themoviedb.org/3/${
          query ? `search/movie?query=${query}` : "movie/now_playing"
        }`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWE1OTU2NjVhODdkMWY1ZTUzOTI3ZjQ0OTdmNGE1NSIsIm5iZiI6MTcyMzUyOTc1OC43Mzc5MDIsInN1YiI6IjY2YjllYzQ0OTdlODlkMjU4OTMwYTBmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.T2ZrgcFR6nwN9fS_7OcQxF8RgKku9AUB5AU3zO1XgWQ",
          },
        }
      );

      console.log("API response status:", res.status); // Log the status code of the response

      if (!res.ok) {
        throw new Error(`Failed to fetch movies: ${res.statusText}`);
      }

      // Parse the JSON data from the response.
      const data = await res.json();
      console.log("API response data:", data);

      // Check if results exist and set them in state.
      if (data.results) {
        console.log("Setting movies state with data:", data.results);
        setMovies(data.results);
      } else {
        console.log("No results found in the API response.");
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      setError(error.message); // Set the error state if the fetch fails
    }
  };

  // Function to add a movie to the favorites list and store it in localStorage.
  const addToFavorites = (movie) => {
    console.log("Adding movie to favorites:", movie.title);
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some((fav) => fav.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      console.log(`${movie.title} has been added to your favorites!`);
    } else {
      console.log(`${movie.title} is already in your favorites!`);
    }
  };

  return (
    <div>
      {/* Render the SearchBar component */}
      <SearchBar onSearch={fetchMovies} />
      {/* Conditionally render an error message or the list of movies */}
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <MovieList movies={movies} onAddToFavorites={addToFavorites} />
      )}
    </div>
  );
};

export default Home;
