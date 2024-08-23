// Base URL for images from the API
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Reference to the main container where movie cards will be displayed
const main = document.getElementById(`main`);

// Options for the fetch request including the API key for authorization
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWE1OTU2NjVhODdkMWY1ZTUzOTI3ZjQ0OTdmNGE1NSIsIm5iZiI6MTcyMzUyOTc1OC43Mzc5MDIsInN1YiI6IjY2YjllYzQ0OTdlODlkMjU4OTMwYTBmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.T2ZrgcFR6nwN9fS_7OcQxF8RgKku9AUB5AU3zO1XgWQ",
  },
};

// Function to fetch and display the currently playing movies
const getFilme = async () => {
  try {
    // Fetch the data from the API
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing",
      options
    );
    console.log(res);
    if (!res.ok) throw Error("Fetching failed");

    const filmedata = await res.json();

    console.log(filmedata);
    // Pass the fetched movie data to the function to display the movies
    Showmovies(filmedata.results);
  } catch (error) {
    // Log any errors that occur during the fetch process
    console.error(error);
  }
};

// Initial fetch to display movies when the page loads
getFilme();

// Function to display movie cards on the page
function Showmovies(filmedata) {
  main.innerHTML = ``; // Clear any existing content in the main container
  filmedata.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;

    // Create a new div element for each movie
    const movieEl = document.createElement(`div`);
    movieEl.classList.add(`movie`);
    movieEl.innerHTML = `
      <img src="${IMG_URL + poster_path}" alt="${title}">
      <button
        class="absolute top-2 right-2 bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center"
        title="Add to Journal">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}"> ${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>`;
    main.appendChild(movieEl);

    // Add event listener to the button to add the movie to favorites
    const addButton = movieEl.querySelector("button");
    addButton.addEventListener("click", () =>
      addToFavorites({ title, poster_path, vote_average, overview, id })
    );
  });
}

// Function to add a movie to the favorites list and save it to localStorage
function addToFavorites(movie) {
  // Retrieve the current favorites from localStorage, or create an empty array if it doesn't exist
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if the movie is already in the favorites array
  const isAlreadyFavorite = favorites.some(
    (favMovie) => favMovie.id === movie.id
  );

  if (!isAlreadyFavorite) {
    // Add the new movie to the array
    favorites.push(movie);

    // Save the updated array back to localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Log a message and the current favorites array to the console
    console.log(`${movie.title} has been added to your favorites!`);
    console.log("Current Favorites Array:", favorites);

    // Display a message to the user that the movie has been added to favorites
    alert(`${movie.title} has been added to your favorites!`);
  } else {
    // Display a message if the movie is already in the favorites list
    alert(`${movie.title} is already in your favorites!`);
  }
}

// Function to determine the color of the rating based on the score
function getColor(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Fetch and display suggestions as the user types in the search input
// Get references to the search input and autocomplete dropdown elements
const searchInput = document.getElementById("searchInput");
const autocompleteDropdown = document.getElementById("autocompleteDropdown");

// Add an event listener to the search input to trigger on every keystroke
searchInput.addEventListener("input", async () => {
  const query = searchInput.value; // Get the current value of the input

  if (query.length > 0) {
    // If the input is not empty, fetch matching movies
    const suggestions = await fetchMovies(query);
    showSuggestions(suggestions); // Display the suggestions in the dropdown
  } else {
    // If the input is empty, clear the dropdown and hide it
    autocompleteDropdown.innerHTML = "";
    autocompleteDropdown.classList.add("hidden");
  }
});

// Function to fetch movies that match the query
async function fetchMovies(query) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false`,
    options
  );
  const data = await res.json(); // Parse the response to JSON
  return data.results; // Return the array of matching movies
}

// Function to display the movie suggestions in the dropdown
function showSuggestions(movies) {
  autocompleteDropdown.innerHTML = ""; // Clear any existing suggestions

  movies.forEach((movie) => {
    // Create a new div element for each suggestion
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("p-2", "hover:bg-blue-100", "cursor-pointer"); // Style the suggestion item
    suggestionItem.textContent = movie.title; // Set the movie title as the text

    // Add an event listener to handle clicks on the suggestion
    suggestionItem.addEventListener("click", () => {
      searchInput.value = movie.title; // Set the search input value to the selected suggestion
      autocompleteDropdown.innerHTML = ""; // Clear the dropdown
      autocompleteDropdown.classList.add("hidden"); // Hide the dropdown
    });

    // Append the suggestion item to the dropdown
    autocompleteDropdown.appendChild(suggestionItem);
  });

  // Show the dropdown if there are suggestions
  autocompleteDropdown.classList.remove("hidden");
}

// Handle the form submission for the search
document
  .getElementById("searchForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission (page reload)

    const query = searchInput.value; // Get the current value of the input
    if (query.length > 0) {
      const searchResults = await fetchMovies(query); // Fetch matching movies if input is not empty

      main.innerHTML = ""; // Clear the main section content

      // Create the container that includes both the heading and the movie cards
      const resultsContainer = document.createElement("div");
      resultsContainer.classList.add("results");
      resultsContainer.innerHTML = `<h2>Search Results:</h2>`;

      // Append movie elements directly beneath the heading in the same container
      searchResults.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie;
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
      <img src="${IMG_URL + poster_path}" alt="${title}">
      <button
        class="absolute top-2 right-2 bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center"
        title="Add to Journal">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}"> ${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>`;
        resultsContainer.appendChild(movieEl); // Append each movie card to the container
      });

      main.appendChild(resultsContainer); // Append the full container to the main section

      autocompleteDropdown.innerHTML = ""; // Clear and hide the dropdown after search
      autocompleteDropdown.classList.add("hidden");
    }
  });

//Close the Dropdown When the Search Button is Pressed
document
  .getElementById("searchForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission (page reload)

    const query = searchInput.value; // Get the current value of the input
    if (query.length > 0) {
      // If the input is not empty, fetch matching movies
      const searchResults = await fetchMovies(query);
      showSearchResults(searchResults); // Display the results as cards

      // Clear and hide the dropdown after search
      autocompleteDropdown.innerHTML = "";
      autocompleteDropdown.classList.add("hidden");
    }
  });

//Keyboard Navigation for the Dropdown
let currentFocus = -1; // Variable to keep track of the focused item in the dropdown

searchInput.addEventListener("keydown", (event) => {
  const items = autocompleteDropdown.getElementsByTagName("div"); // Get all items in the dropdown

  if (event.key === "ArrowDown") {
    // If the down arrow key is pressed
    currentFocus++;
    addActive(items);
  } else if (event.key === "ArrowUp") {
    // If the up arrow key is pressed
    currentFocus--;
    addActive(items);
  } else if (event.key === "Enter") {
    // If the Enter key is pressed
    event.preventDefault();
    if (currentFocus > -1) {
      // Simulate a click on the focused item
      if (items) items[currentFocus].click();
    }
  }
});

function addActive(items) {
  // Function to add the "active" class to a focused item
  if (!items) return false;
  removeActive(items); // Remove "active" class from all items
  if (currentFocus >= items.length) currentFocus = 0; // Loop back to the first item
  if (currentFocus < 0) currentFocus = items.length - 1; // Loop back to the last item
  items[currentFocus].classList.add("autocomplete-active"); // Add active class to the focused item
}

function removeActive(items) {
  // Function to remove the "active" class from all items
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("autocomplete-active");
  }
}

//Auto close Dropdown when not needed
let dropdownTimeout; // Variable to hold the timeout reference

searchInput.addEventListener("input", async () => {
  clearTimeout(dropdownTimeout); // Clear any existing timeout

  const query = searchInput.value; // Get the current value of the input

  if (query.length > 0) {
    // If the input is not empty, fetch matching movies
    const suggestions = await fetchMovies(query);
    showSuggestions(suggestions); // Display the suggestions in the dropdown

    // Set a timeout to close the dropdown after 5 seconds if not hovered
    dropdownTimeout = setTimeout(() => {
      autocompleteDropdown.classList.add("hidden");
    }, 5000);
  } else {
    // If the input is empty, clear the dropdown and hide it
    autocompleteDropdown.innerHTML = "";
    autocompleteDropdown.classList.add("hidden");
  }
});

autocompleteDropdown.addEventListener("mouseenter", () => {
  // Clear the timeout if the user hovers over the dropdown
  clearTimeout(dropdownTimeout);
});

autocompleteDropdown.addEventListener("mouseleave", () => {
  // Restart the timeout to close the dropdown after 5 seconds if the user stops hovering
  dropdownTimeout = setTimeout(() => {
    autocompleteDropdown.classList.add("hidden");
  }, 5000);
});

// Close the dropdown if the user clicks anywhere outside of the dropdown or the input
document.addEventListener("click", (event) => {
  if (
    !autocompleteDropdown.contains(event.target) &&
    !searchInput.contains(event.target)
  ) {
    autocompleteDropdown.classList.add("hidden");
  }
});
