const API_KEY = "ce95096f";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const moviesDiv = document.getElementById("movies");
const favoritesDiv = document.getElementById("favorites");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

showFavorites();

searchBtn.addEventListener("click", searchMovie);

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchMovie();
  }
});

async function searchMovie() {
  const movie = searchInput.value.trim();

  if (movie === "") {
    alert("Please enter a movie name.");
    return;
  }

  moviesDiv.innerHTML = "<h2>Loading...</h2>";

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${movie}`
  );

  const data = await response.json();

  if (data.Response === "False") {
    moviesDiv.innerHTML = "<h2>No Movies Found</h2>";
    return;
  }

  displayMovies(data.Search);
}

function displayMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach((movie) => {
    const card = document.createElement("div");

    card.className = "card";

    const poster =
      movie.Poster === "N/A"
        ? "https://via.placeholder.com/300x450?text=No+Image"
        : movie.Poster;

    card.innerHTML = `
      <img src="${poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <p>${movie.Type}</p>
      <button onclick='addFavorite(${JSON.stringify(movie)})'>
        ⭐ Save
      </button>
    `;

    moviesDiv.appendChild(card);
  });
}

function addFavorite(movie) {
  if (favorites.find((f) => f.imdbID === movie.imdbID)) {
    alert("Movie already in favorites!");
    return;
  }

  favorites.push(movie);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  showFavorites();

  alert("Movie added to favorites!");
}

function showFavorites() {
  favoritesDiv.innerHTML = "";

  favorites.forEach((movie) => {
    const card = document.createElement("div");

    card.className = "card";

    const poster =
      movie.Poster === "N/A"
        ? "https://via.placeholder.com/300x450?text=No+Image"
        : movie.Poster;

    card.innerHTML = `
      <img src="${poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="removeFavorite('${movie.imdbID}')">
        ❌ Remove
      </button>
    `;

    favoritesDiv.appendChild(card);
  });
}

function removeFavorite(id) {
  favorites = favorites.filter((movie) => movie.imdbID !== id);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  showFavorites();
}
