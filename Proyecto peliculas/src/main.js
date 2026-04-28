import "./scss/style.scss";
import "./scss/styles.scss";
console.clear();
import { movies } from './movies.js';



//Estado Global

let currentState = {
  category: 'noFiltrar',
  sort: 'default',
  search: '',
}

const movieContainer = document.createElement('div');
movieContainer.className = 'movie-container';

const resultsMessage = document.createElement('div');
resultsMessage.id = 'search-message';
resultsMessage.style.display = 'none'



// Funciones de interfaz

function getStars(rating) {
  const starCount = Math.round(rating / 2);
  return '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

}

function createPosterElement(poster) {
  const element = document.createElement('img');
  element.src = poster;
  element.className = 'movie-poster';
  return element
}

function createTitleElement(title) {
  const element = document.createElement('div');
  element.className = 'movie-title';
  element.textContent = title;
  return element;
}

function createDataElement(rating, year) {
  const element = document.createElement('div');
  element.className = 'movie-data';
  element.textContent = `${rating} | ${year}`;
  return element;
}

function createDescriptionHeadingElement() {
  const element = document.createElement('div');
  element.className = 'movie-description-heading';
  element.textContent = 'Summary'
  return element;
}

function createDescriptionElement(description) {
  const element = document.createElement('div');
  element.className = 'movie-description';
  element.textContent = description;
  return element;
}

function createMovieInfoLine(label, value) {
  const element = document.createElement('div');
  element.className = 'movie-other';
  const span = document.createElement('span');
  span.textContent = label;
  element.appendChild(span);
  element.append(` ${value}`);
  return element;
}

// tarjeta tipo cuadricula
function createMovieElement(movieObj) {
  const movieElement = document.createElement('div');
  movieElement.className = 'movie';

  movieElement.appendChild(createPosterElement(movieObj.poster));
  movieElement.appendChild(createTitleElement(movieObj.title));
  movieElement.appendChild(createDataElement(`Rating ${movieObj.rating}`, movieObj.year));
  movieElement.appendChild(createDescriptionHeadingElement());
  movieElement.appendChild(createDescriptionElement(movieObj.description));
  movieElement.appendChild(createMovieInfoLine("Director:", movieObj.director));
  movieElement.appendChild(createMovieInfoLine("Actors:", movieObj.actors));
  movieElement.appendChild(createMovieInfoLine("Category:", movieObj.category));

  return movieElement;
}

//Funcion para crear la tarjeta en lista
function createMovieListElement(movieObj) {
  const element = document.createElement('div');
  element.className = 'movie-list-item';

  const img = document.createElement('img');
  img.src = movieObj.poster;
  img.className = 'movie-list-poster';

  const title = document.createElement('div');
  title.className = 'movie-list-title';
  title.textContent = `${movieObj.title} (${movieObj.year})`;

  const info = document.createElement('div');
  info.className = 'movie-list-info';

  const stars = document.createElement('span');
  stars.className = 'movie-stars';
  stars.textContent = getStars(movieObj.rating);

  const randomReviews = Math.floor(Math.random() * 500) + 1;
  const reviews = document.createElement('span');
  reviews.className = 'movie-reviews';
  reviews.textContent = `(${randomReviews} reviews)`;

  info.appendChild(stars);
  info.appendChild(reviews);

  element.appendChild(img);
  element.appendChild(title);
  element.appendChild(info);

  return element;

}

function renderMovies(movieList) {
  movieContainer.innerHTML = "";
  const isListMode = movieContainer.classList.contains('list-mode');

  movieList.forEach(movie => {
    const element = isListMode ? createMovieListElement(movie) : createMovieElement(movie);
    movieContainer.appendChild(element);
  });
}

//Logica principal

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const categoriesMap = Object.freeze({
  noFiltrar: "Categoría: Todas",
  drama: "Drama",
  action: "Action",
  crime: "Crime",
  biography: "Biography",
  adventure: "Adventure",
  comedy: "Comedy",
});

function applyFiltersAndRender() {
  let result = [...movies];

  // 1. Filtrar por Categoría
  if (currentState.category !== 'noFiltrar') {
    const realCategoryName = categoriesMap[currentState.category];
    result = result.filter(movie => movie.category === realCategoryName);
  }

  // 2. Filtrar por Búsqueda de texto
  if (currentState.search) {
    const query = currentState.search.toLowerCase();
    result = result.filter(movie => {
      return movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.actors.toLowerCase().includes(query) ||
        movie.year.toString().includes(query);
    });
  }

  // 3. Ordenacion
  if (currentState.sort !== 'default') {
    result.sort((a, b) => {
      switch (currentState.sort) {
        case 'titleAsc': return a.title.localeCompare(b.title);
        case 'titleDesc': return b.title.localeCompare(a.title);
        case 'directorAsc': return a.director.localeCompare(b.director);
        case 'directorDesc': return b.director.localeCompare(a.director);
        case 'yearAsc': return a.year - b.year;
        case 'yearDesc': return b.year - a.year;
        default: return 0;
      }
    });
  }
  // 4. Mensaje de cuantas peliculas encuentra
  if (currentState.search !== '' || currentState.category !== 'noFiltrar') {
    resultsMessage.style.display = 'block';
    resultsMessage.textContent = `Se han encontrado [${result.length}] peliculas que coinciden con la busqueda `;
  } else {
    resultsMessage.style.display = 'none';
  }

  //5 Mostrar en pantalla

  renderMovies(result);
}







//Controles
const divContenedor = document.createElement('div');
divContenedor.className = 'divContenedor'

const buttonsContainer = document.createElement('div');
buttonsContainer.className = 'button-container';

//SVG para modo lista
const listSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/></svg>`;
//SVG para modo cuadricula
const gridSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h80v-80h-80v80Zm160 0h80v-80h-80v80Zm160 0h80v-80h-80v80Zm160 0h80v-80h-80v80ZM200-680h80v-80h-80v80Zm0 160h80v-80h-80v80Zm0 160h80v-80h-80v80Zm160-320h80v-80h-80v80Zm0 160h80v-80h-80v80Zm0 160h80v-80h-80v80Zm160-320h80v-80h-80v80Zm0 160h80v-80h-80v80Zm0 160h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z"/></svg>`;

//Boton grid
const buttonGrid = document.createElement('button');
buttonGrid.className = 'grid fake-button';
buttonGrid.innerHTML = gridSvg;

//boton list
const buttonList = document.createElement('button');
buttonList.className = 'list fake-button';
buttonList.innerHTML = listSvg;

buttonsContainer.append(buttonGrid, buttonList);


// Selector de Categorias
const selectCategory = document.createElement('select');
selectCategory.className = 'select categories';
Object.entries(categoriesMap).forEach(([key, value]) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = value;
  selectCategory.appendChild(option);
})

// Selector de ordenación 
const sortOptionsMap = {
  default: "Ordenar por...",
  titleAsc: "Titulo (A-Z)",
  titleDesc: "Titulo (Z-A)",
  directorAsc: "Director (A-Z)",
  directorDesc: "Director (Z-A)",
  yearAsc: "Año (Antiguas primero)",
  yearDesc: "Año (Nuevas primero)",
};
const selectSort = document.createElement('select');
selectSort.className = 'select sort';
Object.entries(sortOptionsMap).forEach(([key, text]) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = text;
  selectSort.appendChild(option);

});

// barra de busqueda
const searchInput = document.createElement('input');
searchInput.type = "text";
searchInput.placeholder = "Buscar peliculas, actor...";
searchInput.className = 'search-input';

// boton de reset
const btnReset = document.createElement('button');
btnReset.id = 'reset-btn';
btnReset.textContent = 'Resetear Filtros';


divContenedor.append(buttonsContainer, selectCategory, selectSort, searchInput, btnReset);

const appContainer = document.querySelector("#app");
appContainer.append(divContenedor, resultsMessage, movieContainer);




// Event listeners
selectCategory.addEventListener('change', (e) => {
  currentState.category = e.target.value;
  applyFiltersAndRender();
})

selectSort.addEventListener('change', (e) => {
  currentState.sort = e.target.value;
  applyFiltersAndRender();
});

searchInput.addEventListener('input', debounce((e) => {
  currentState.search = e.target.value.trim();
  applyFiltersAndRender();
}, 500));

btnReset.addEventListener('click', () => {
  selectCategory.value = 'noFiltrar';
  selectSort.value = 'default';
  searchInput.value = '';

  currentState = { category: 'noFiltrar', sort: 'default', search: '' };
  applyFiltersAndRender();
});

buttonGrid.addEventListener("click", () => {
  movieContainer.classList.remove("list-mode");
  applyFiltersAndRender();
});

buttonList.addEventListener("click", () => {
  movieContainer.classList.add('list-mode');
  applyFiltersAndRender();
});

applyFiltersAndRender();