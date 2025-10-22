// Lyrics database - loaded from JSON file
let lyricsDatabase = [];

// Global variables
let currentLyricIndex = 0;
let favorites = JSON.parse(localStorage.getItem("yeezyFavorites")) || [];
let usedIndices = new Set();

// Load lyrics from JSON file
async function loadLyrics() {
  try {
    const response = await fetch("lyrics.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    lyricsDatabase = await response.json();
    console.log(`Loaded ${lyricsDatabase.length} lyrics from JSON file`);
  } catch (error) {
    console.error("Error loading lyrics:", error);
    // Fallback to a minimal dataset if JSON loading fails
    lyricsDatabase = [
      {
        text: "Error loading lyrics. Please check your connection and refresh the page.",
        song: "System Error",
        album: "Technical Difficulties",
        year: "2024",
      },
    ];
  }
}

// DOM elements
const lyricText = document.getElementById("lyricText");
const songTitle = document.getElementById("songTitle");
const albumYear = document.getElementById("albumYear");
const lyricCard = document.getElementById("lyricCard");
const randomBtn = document.getElementById("randomBtn");
const nextBtn = document.getElementById("nextBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const favoriteText = document.getElementById("favoriteText");
const favoritesSection = document.getElementById("favoritesSection");
const favoritesList = document.getElementById("favoritesList");
const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");

// Initialize the app
document.addEventListener("DOMContentLoaded", async function () {
  // Load lyrics first, then initialize the app
  await loadLyrics();

  updateFavoritesDisplay();
  showRandomLyric();

  // Event listeners
  randomBtn.addEventListener("click", showRandomLyric);
  nextBtn.addEventListener("click", showNextLyric);
  favoriteBtn.addEventListener("click", toggleFavorite);
  clearFavoritesBtn.addEventListener("click", clearFavorites);

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && e.target.tagName !== "INPUT") {
      e.preventDefault();
      showRandomLyric();
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      showNextLyric();
    } else if (e.code === "KeyF") {
      e.preventDefault();
      toggleFavorite();
    }
  });
});

// Show a random lyric
function showRandomLyric() {
  // Reset used indices if we've used all lyrics
  if (usedIndices.size >= lyricsDatabase.length) {
    usedIndices.clear();
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * lyricsDatabase.length);
  } while (usedIndices.has(randomIndex));

  usedIndices.add(randomIndex);
  currentLyricIndex = randomIndex;
  displayLyric(lyricsDatabase[currentLyricIndex]);
}

// Show the next lyric in sequence
function showNextLyric() {
  currentLyricIndex = (currentLyricIndex + 1) % lyricsDatabase.length;
  displayLyric(lyricsDatabase[currentLyricIndex]);
}

// Display a lyric with animation
function displayLyric(lyric) {
  // Add loading state
  lyricText.innerHTML = '<div class="loading"></div>';
  lyricCard.classList.remove("animate");

  // Simulate loading delay for better UX
  setTimeout(() => {
    lyricText.textContent = lyric.text;
    songTitle.textContent = lyric.song;
    albumYear.textContent = `${lyric.album} (${lyric.year})`;

    // Add animation
    lyricCard.classList.add("animate");

    // Update favorite button state
    updateFavoriteButton();
  }, 300);
}

// Toggle favorite status
function toggleFavorite() {
  const currentLyric = lyricsDatabase[currentLyricIndex];
  const lyricId = `${currentLyric.song}-${currentLyricIndex}`;

  const existingIndex = favorites.findIndex((fav) => fav.id === lyricId);

  if (existingIndex > -1) {
    // Remove from favorites
    favorites.splice(existingIndex, 1);
  } else {
    // Add to favorites
    favorites.push({
      id: lyricId,
      text: currentLyric.text,
      song: currentLyric.song,
      album: currentLyric.album,
      year: currentLyric.year,
    });
  }

  // Save to localStorage
  localStorage.setItem("yeezyFavorites", JSON.stringify(favorites));

  // Update UI
  updateFavoriteButton();
  updateFavoritesDisplay();
}

// Update favorite button appearance
function updateFavoriteButton() {
  const currentLyric = lyricsDatabase[currentLyricIndex];
  const lyricId = `${currentLyric.song}-${currentLyricIndex}`;
  const isFavorited = favorites.some((fav) => fav.id === lyricId);

  if (isFavorited) {
    favoriteBtn.classList.add("favorited");
    favoriteText.textContent = "Remove from Favorites";
  } else {
    favoriteBtn.classList.remove("favorited");
    favoriteText.textContent = "Add to Favorites";
  }
}

// Update favorites display
function updateFavoritesDisplay() {
  if (favorites.length === 0) {
    favoritesSection.style.display = "none";
    return;
  }

  favoritesSection.style.display = "block";
  favoritesList.innerHTML = "";

  favorites.forEach((favorite) => {
    const favoriteItem = document.createElement("div");
    favoriteItem.className = "favorite-item";
    favoriteItem.innerHTML = `
            <div class="favorite-text">${favorite.text}</div>
            <div class="favorite-meta">${favorite.song} - ${favorite.album} (${favorite.year})</div>
        `;

    // Add click to display this lyric
    favoriteItem.addEventListener("click", () => {
      const lyricIndex = lyricsDatabase.findIndex(
        (lyric) => lyric.text === favorite.text && lyric.song === favorite.song
      );
      if (lyricIndex > -1) {
        currentLyricIndex = lyricIndex;
        displayLyric(lyricsDatabase[currentLyricIndex]);
        updateFavoriteButton();
      }
    });

    favoritesList.appendChild(favoriteItem);
  });
}

// Clear all favorites
function clearFavorites() {
  if (confirm("Are you sure you want to clear all favorites?")) {
    favorites = [];
    localStorage.setItem("yeezyFavorites", JSON.stringify(favorites));
    updateFavoritesDisplay();
    updateFavoriteButton();
  }
}

// Add some fun easter eggs
let clickCount = 0;
document.querySelector(".title").addEventListener("click", function () {
  clickCount++;
  if (clickCount === 5) {
    alert("🌊 Yeezy taught me well! 🌊");
    clickCount = 0;
  }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
