const savedFilms = document.getElementById("saved-films");
let watchlistArray = [];

function watchlist() {
  savedFilms.innerHTML = localStorage.length
    ? getFromLocalStorage()
    : `
    <div class="back-text">
      <h2>Your watchlist is looking a little empty...</h2>
  
      <a href="./index.html" title="Go to the main page" class="icon-text">
      <span class="material-symbols-rounded">add_circle</span>
      Let's add some movies!
      </a>
    </div>
  `;

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      addRemoveButton(key);
    }
  }
}
watchlist();

function getFromLocalStorage() {
  watchlistArray = [];

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      watchlistArray.push(JSON.parse(localStorage.getItem(key)));
    }
  }

  savedFilms.style.paddingTop = "15px";

  return watchlistArray.join("");
}
