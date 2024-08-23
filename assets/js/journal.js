const IMG_URL = "https://image.tmdb.org/t/p/w500"; // Define the IMG_URL to be used for images

// Reference to the main container where favorite movies will be displayed
const journal = document.getElementById("journal");

// Function to retrieve and display favorite movies from localStorage
function loadFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Retrieve existing favorites from localStorage or create an empty array
  journal.innerHTML = ""; // Clear any previous content in the journal container

  // Loop through the favorite movies and create a card for each
  favorites.forEach((movie, index) => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement("div"); // Create a new div element for the movie card
    movieEl.classList.add(
      "movie",
      "bg-white",
      "rounded-lg",
      "shadow-lg",
      "overflow-hidden",
      "relative"
      //"p-4"
    ); // Add classes for styling
    movieEl.innerHTML = `
            <!-- Remove Button -->
            <button
              class="remove-favorite absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-lg flex items-center justify-center"
              title="Remove from Favorites"
              data-id="${movie.id}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <!-- Movie Poster -->
            <img src="${
              IMG_URL + poster_path
            }" alt="${title}" class="w-full h-96 object-cover h-64 mb-4">
            
            <!-- Title and Rating -->
            <div class="flex justify-between p-4 items-center mb-2">
                <h3 class="text-lg font-bold text-black">${title}</h3>
                <span class="${getColor(
                  vote_average
                )} px-2 py-1 rounded-lg">${vote_average}</span>
            </div>
            
            <!-- Movie Overview -->
            <p class="text-gray-700 p-4">
              ${
                overview.length > 30
                  ? overview.substring(0, 50) + "..."
                  : overview
              } 
              <a href="#" class="underline text-blue-500">Read more</a>
            </p>
            
            <div class="flex flex-col p-4 items-end">
  <!-- Text area for adding personal notes -->
  <textarea id="note-${index}" class="w-full p-2 border border-gray-300 rounded-lg mb-2" placeholder="Add your notes here...">${
      movie.note || ""
    }</textarea>

  <!-- Button to save personal notes -->
  <button class="save-note bg-blue-500 text-white px-4 py-2 rounded-lg" data-index="${index}">Save Note</button>
</div>`;
    journal.appendChild(movieEl); // Append the movie card to the journal container

    // Add event listener to the "Save Note" button
    movieEl.querySelector(".save-note").addEventListener("click", () => {
      saveNote(index); // Call the function to save the personal note
    });

    // Add event listener to the "Remove from Favorites" button
    movieEl.querySelector(".remove-favorite").addEventListener("click", () => {
      removeFromFavorites(movie.id); // Call the function to remove the movie from favorites
    });
  });
}

// Function to set the color of the rating based on the score
function getColor(vote) {
  if (vote >= 8) {
    return "green bg-green-500 text-white";
  } else if (vote >= 5) {
    return "orange bg-orange-500 text-white";
  } else {
    return "red bg-red-500 text-white";
  }
}

// Function to save personal notes to the corresponding movie in localStorage
function saveNote(index) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Retrieve existing favorites from localStorage
  const note = document.getElementById(`note-${index}`).value; // Get the note from the text area
  favorites[index].note = note; // Add/update the note in the corresponding movie object
  localStorage.setItem("favorites", JSON.stringify(favorites)); // Save the updated favorites array back to localStorage
}

// Function to remove a movie from the favorites list in localStorage
function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Retrieve existing favorites from localStorage

  // Filter out the movie with the matching ID
  favorites = favorites.filter((movie) => movie.id !== id);

  // Save the updated array back to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Reload the favorites list to reflect the removal
  loadFavorites();

  // Optional: Log a message to the console
  console.log(`Movie with ID ${id} has been removed from your favorites.`);
}

// Initial call to load favorite movies
loadFavorites();
