// movie-details.js

// Importamos nuestra conexión a la API

import { getMovieDetails } from './movies-api.js';

/**
 * Función para mostrar los detalles. 
 * Ahora recibe parámetros externos para no depender de main.js
 */
export async function showMovieDetails(movieId, mainContainer, headerContainer, onBackCallback, savedScroll) {

  window.scrollTo(0, 0);

  // 1. Mostramos carga y ocultamos el menú superior
  mainContainer.innerHTML = '';
  headerContainer.style.display = 'none';
  const searchMessage = document.getElementById('search-message');
  if (searchMessage) {
    searchMessage.style.display = 'none';
  }

  // 2. Traemos los datos
  const detalles = await getMovieDetails(movieId);



  //contenedor de detalles
  function createMovieDetails(detalles) {
    const btnback = document.createElement('button');
    btnback.id = "btn-back";
    btnback.className = "btn-back";
    btnback.textContent = "← volver atras";

    const sectionDetalles = document.createElement("section");
    sectionDetalles.className = "contenedor-detalles";



    const infoDiv = document.createElement("div");
    infoDiv.className = "info-div";

    const title = document.createElement("h1");
    title.className = "movie-details-title";
    title.textContent = `${detalles.title} (${detalles.year})`;

    const backdrop = document.createElement('img');
    backdrop.src = detalles.backdrop;
    backdrop.className = "movie-details-backdrop";

    const ratingdiv = document.createElement("div");
    ratingdiv.className = "movie-details-rating-div";

    const rating = document.createElement("div");
    rating.className = "movie-details-rating";
    rating.textContent = `${detalles.rating}`;

    const ratingStars = document.createElement("div");
    ratingStars.className = "movie-details-rating-stars";
    const fullStars = Math.floor(detalles.rating / 2);
    const halfStar = detalles.rating % 2 >= 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.innerHTML = "★";
      ratingStars.appendChild(star);
    }

    if (halfStar) {
      const halfStarElement = document.createElement("span");
      halfStarElement.className = "star";
      halfStarElement.innerHTML = "☆";
      ratingStars.appendChild(halfStarElement);
    }

    for (let i = 0; i < emptyStars; i++) {
      const emptyStar = document.createElement("span");
      emptyStar.className = "star";
      emptyStar.innerHTML = "☆";
      emptyStar.style.color = "#ccc";
      ratingStars.appendChild(emptyStar);
    }
    ratingdiv.append(rating, ratingStars);
    const miniDataDiv = document.createElement("div");
    miniDataDiv.className = "movie-details-mini-data";
    miniDataDiv.id = "mini-data-div";

    const yearDiv = document.createElement("div");
    yearDiv.className = "year-div";
    const year = document.createElement("p");
    year.className = "movie-details-year";
    year.textContent = `${detalles.year}`;

    yearDiv.appendChild(year);
    // Insertamos primero el elemento del año
    miniDataDiv.append(yearDiv);

    // Limpiamos y separamos la cadena de géneros de forma robusta
    const genresString = String(detalles.genres);
    const genresArray = genresString.includes(',')
      ? genresString.split(',')
      : genresString.split('  ');

    // Iteramos para crear e insertar los <p> individuales
    genresArray.forEach(genreText => {
      if (genreText.trim() !== "") {
        const genreElementdiv = document.createElement("div");
        genreElementdiv.className = "genre-div";
        const genreElement = document.createElement("p");
        genreElement.className = "movie-details-genres";
        genreElement.textContent = genreText.trim();
        genreElementdiv.append(genreElement);
        miniDataDiv.append(genreElementdiv);
      }
    });


    const description = document.createElement("p");
    description.className = "movie-details-description";
    description.innerHTML = `${detalles.description}`;

    const divDirector = document.createElement("div");
    divDirector.className = "director-div";
    divDirector.textContent = "Directed by ";
    const director = document.createElement("p");
    director.className = "movie-details-director";
    director.textContent = `${detalles.director}`;
    divDirector.appendChild(director);

    const divPoster = document.createElement("div");
    divPoster.className = "poster-div";

    const poster = document.createElement('img');
    poster.src = detalles.poster;
    poster.className = "movie-details-poster"
    divPoster.appendChild(poster);

    const trailerDiv = document.createElement("div");
    trailerDiv.className = "trailer-div";
    const buttonTrailer = document.createElement("button");
    buttonTrailer.className = "btn-trailer";
    buttonTrailer.textContent = "Watch Trailer";
    buttonTrailer.addEventListener("click", () => {
      if (detalles.trailerKey) {
        createModalTrailer(detalles.trailerKey);
      }else{
        alert("No trailer available for this movie.");
      }
    });

  
    function createModalTrailer(trailerUrl) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '1000';


  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';
  videoContainer.style.position = 'relative';
  videoContainer.style.width = '80%';
  videoContainer.style.maxWidth = '800px';
  videoContainer.style.aspectRatio = '16 / 9';
  videoContainer.style.backgroundColor = '#000';
  videoContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';

  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close-button';
  closeButton.textContent = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.fontSize = '24px';
  closeButton.style.color = '#fff';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${trailerUrl}?autoplay=1&controls=1`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.allowFullscreen = true;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';


  videoContainer.appendChild(closeButton);
  videoContainer.appendChild(iframe);
  modalOverlay.appendChild(videoContainer);

  document.body.appendChild(modalOverlay);

  const closeModal = () => {
    document.body.removeChild(modalOverlay);
  };
  closeButton.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

    const trianglediv = document.createElement("div");
    trianglediv.className = "triangle-div";
    buttonTrailer.appendChild(trianglediv);
    trailerDiv.appendChild(buttonTrailer);

    infoDiv.append(backdrop, miniDataDiv, title, description, divDirector, ratingdiv, trailerDiv);
    sectionDetalles.append(infoDiv, divPoster, btnback);

    return sectionDetalles;
  }


  //contenedor de actores
  function createActorsDetails(castArray) {
    const divActores = document.createElement('div');
    divActores.className = 'actores-container';
    divActores.style.width = '100%';
    divActores.style.marginTop = '30px';

    const tituloActores = document.createElement('h2');
    tituloActores.className = 'actores-title';
    tituloActores.textContent = 'Reparto Principal';




    divActores.appendChild(tituloActores);

    const ul = document.createElement('ul');
    ul.className = 'actores-list';



    const actoresList = castArray || [];

    actoresList.forEach(actor => {
      const li = document.createElement('li');

      const img = document.createElement('img');
      img.src = actor.photo;
      img.alt = actor.name;
      img.alt = actor.character;
      img.className = 'actor-photo';

      const name = document.createElement('p');
      name.textContent = actor.name;

      const character = document.createElement('p');
      character.textContent = actor.character;
      character.className = 'actor-character';

      li.append(img, name, character);
      ul.appendChild(li);
    });

    divActores.appendChild(ul);
    return divActores;
  }


  //contenedor de reseñas
  function createReviewsDetails(reviewsArray) {
    const divResenas = document.createElement('div');
    divResenas.className = 'reviews-container';
    divResenas.style.width = '100%';
    divResenas.style.marginTop = '40px';

    const tituloResenas = document.createElement('h2');
    tituloResenas.className = 'reviews-title';
    tituloResenas.textContent = 'Reseñas';
    divResenas.appendChild(tituloResenas);

    const ul = document.createElement('ul');
    ul.className = 'reviews-list';
    ul.style.listStyleType = 'none';

    const resenasList = reviewsArray || [];

    if (resenasList.length === 0) {
      const noReviews = document.createElement('p');
      noReviews.className = 'no-reviews-msg';
      noReviews.textContent = 'No hay reseñas disponibles para esta película.';
      ul.appendChild(noReviews);
    } else {
      resenasList.forEach(review => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.flexDirection = 'column';
        li.className = 'review-item';

        const divAuthor = document.createElement('div');
        divAuthor.className = 'review-author-container';
        divAuthor.style.display = 'flex';


        const authorphoto = document.createElement('img');
        authorphoto.src = review.authordetails;
        authorphoto.alt = review.author;
        authorphoto.className = 'review-author-photo';

        const author = document.createElement('h3');
        author.className = 'review-author';
        author.textContent = review.author || 'Usuario Anónimo';
        divAuthor.append(authorphoto, author);

        const content = document.createElement('p');
        content.className = 'review-content';
        content.textContent = review.content || review.text;

        li.append(divAuthor, content);
        ul.appendChild(li);
      });
    }

    divResenas.appendChild(ul);
    return divResenas;
  }


  //contenedor de recomendaciones

  function createRecommendationsDetails(recommendationsArray) {
    const divRecomendaciones = document.createElement('div');
    divRecomendaciones.className = 'recommendations-container';
    divRecomendaciones.style.width = '100%';
    divRecomendaciones.style.marginTop = '40px';
    const tituloRecomendaciones = document.createElement('h2');
    tituloRecomendaciones.className = 'recommendations-title';
    tituloRecomendaciones.textContent = 'Películas Recomendadas';
    divRecomendaciones.appendChild(tituloRecomendaciones);

    const ul = document.createElement('ul');
    ul.className = 'recommendations-list';
    ul.style.listStyleType = 'none';
    const recomendacionesList = recommendationsArray || [];

    if (recomendacionesList.length === 0) {
      const noRecommendations = document.createElement('p');
      noRecommendations.className = 'no-recommendations-msg';
      noRecommendations.textContent = 'No hay recomendaciones disponibles para esta película.';
      ul.appendChild(noRecommendations);
    } else {
      recomendacionesList.forEach(rec => {
        const li = document.createElement('li');
        li.className = 'recommendation-item';

        const divRecItem = document.createElement('div');
        divRecItem.className = 'recommendation-item-container';
        divRecItem.style.display = 'flex';


        const img = document.createElement('img');
        img.src = rec.poster;
        img.alt = rec.title;
        img.className = 'recommendation-poster';
        const title = document.createElement('p');
        title.textContent = rec.title;
        title.className = 'recommendation-title';
        divRecItem.append(img, title);


        li.append(divRecItem);
        ul.appendChild(li);
      })

      divRecomendaciones.appendChild(ul);
      return divRecomendaciones;
    }
  };

  const detallesElemento = createMovieDetails(detalles);
  const actoresElemento = createActorsDetails(detalles.cast);
  const resenasElemento = createReviewsDetails(detalles.reviews);
  const recomendacionesElemento = createRecommendationsDetails(detalles.recommendations);

  const contentWrapper = document.createElement('div');
  contentWrapper.style.gridColumn = '1 / -1';
  contentWrapper.style.width = '100%';
  contentWrapper.style.display = 'flex';
  contentWrapper.style.flexDirection = 'column';
  contentWrapper.style.alignItems = 'center';


  contentWrapper.appendChild(detallesElemento);
  contentWrapper.appendChild(actoresElemento);
  contentWrapper.appendChild(resenasElemento);
  contentWrapper.appendChild(recomendacionesElemento);


  mainContainer.appendChild(contentWrapper);

  // 4. El botón de regresar
  document.getElementById('btn-back').addEventListener('click', () => {
    headerContainer.style.display = 'flex';
    onBackCallback();

    setTimeout(() => {
      window.scrollTo(0, savedScroll);

    }, 0);
  });
}

