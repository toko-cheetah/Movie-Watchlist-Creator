const movieTitle = document.getElementById("movie-title");
const returnedFilms = document.getElementById("returned-films");
let filmsArray = [];

async function searchFilm(event) {
  event.preventDefault();

  try {
    const incompleteDataArray = await incompleteData(movieTitle.value);

    const fullDataArray = await fullData(incompleteDataArray);

    returnedFilms.innerHTML = post(fullDataArray);

    for (let obj of fullDataArray) {
      addRemoveButton(`imdbid-${obj.imdbID}`);
    }
  } catch {
    returnedFilms.innerHTML = `
      <div class="back-text">
        <h2 id="error-text">Unable to find what you're looking for. Please try another search.</h2>
      </div>
    `;
  }
}

async function incompleteData(name) {
  const response = await fetch(`http://www.omdbapi.com/?apikey=97753bae&s=${name}`);
  const data = await response.json();

  return data.Search.map((num) => num.imdbID);
}

async function fullData(imdbId) {
  const promises = imdbId.map(async (id) => {
    const response = await fetch(`http://www.omdbapi.com/?apikey=97753bae&i=${id}&plot=full`);
    const data = await response.json();

    return data;
  });

  const dataArray = Promise.all(promises);
  return dataArray;
}

function post(data) {
  filmsArray = [];

  data.map((num, count) => {
    filmsArray.push(div(num, count));

    count++;
  });

  return filmsArray.join("");
}

function div(num, count = 0) {
  return `
    <div class="film-posts">
      <div class="column">
        <div class="row">
          <h3>${num.Title}</h3>

          <p class="icon-text">
            <span class="material-symbols-rounded" id="star-icon">star</span>
            ${num.imdbRating}
          </p>
        </div>

        <div class="row">
          <p>${num.Runtime}</p>

          <p>${num.Genre}</p>

          <button class="icon-text add-remove-btn" id="imdbid-${num.imdbID}" type="button"
          onclick="addRemoveLocalStorage('imdbid-${num.imdbID}', filmsArray[${count}])"></button>  
        </div>

        <p class="plot-text" id="plot-${num.imdbID}" onclick="readMoreLess('${num.imdbID}')">${num.Plot}
          <span class="read-more-less" id="more-${num.imdbID}">...&nbsp; Read more</span>
        </p>
      </div>

      <img src=${num.Poster} alt="Movie Poster">
    </div>
  `;
}

function readMoreLess(item) {
  const plot = document.getElementById(`plot-${item}`);
  const moreLess = document.getElementById(`more-${item}`);

  if (plot.style.height !== "100%") {
    plot.style.height = "100%";

    moreLess.innerHTML = "";
  } else {
    plot.style.height = "60px";

    moreLess.innerHTML = "...&nbsp; Read more";
  }
}

function addRemoveButton(id) {
  if (localStorage.hasOwnProperty(id)) {
    document.getElementById(id).innerHTML = `
      <span class="material-symbols-rounded">do_not_disturb_on</span>
      Remove
    `;
  } else {
    document.getElementById(id).innerHTML = `
      <span class="material-symbols-rounded">add_circle</span>
      Watchlist
    `;
  }
}

function addRemoveLocalStorage(key, value) {
  if (localStorage.hasOwnProperty(key)) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }

  addRemoveButton(key);

  watchlist();
}
