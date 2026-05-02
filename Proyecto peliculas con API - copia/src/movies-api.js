const API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'en-US';

// Funciones formateadoras
function formatMovie(apiMovie) {
  return {
    id: apiMovie.id,
    title: apiMovie.title,
    description: apiMovie.overview,
    poster: `https://image.tmdb.org/t/p/w500${apiMovie.poster_path}`,
    year: apiMovie.release_date.split('-')[0],
    rating: parseFloat(apiMovie.vote_average.toFixed(2)),
  };
}

function formatMovieDetails(apiData) {
  const actores = apiData.credits.cast
    .slice(0, 4)
    .map(actor => actor.name)
    .join(', ');
  const reparto = apiData.credits.cast
    .slice(0, 10)
    .map(actor => {
      return {
        name: actor.name,
        photo: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=Sin+Foto',
        character: actor.character,
      };
    });
  const directoresObj = apiData.credits.crew.filter(miembro => miembro.job === 'Director');
  const nombreDirector = directoresObj.length > 0
    ? directoresObj.map(director => director.name).join(', ')
    : 'Desconocido';

  const productores = apiData.credits.crew
    .filter(miembro => miembro.job === 'Producer')
    .map(prod => prod.name)
    .join(', ');

  const categorias = apiData.genres.slice(0, 3).map(g => g.name).join('  ');

  const peliculasRecomendadas = apiData.recommendations.results
    .slice(0, 9)
    .map(peli => formatMovie(peli));

  const trailerVideo = apiData.videos && apiData.videos.results 
    ? apiData.videos.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer')
    : null;


  return {
    id: apiData.id,
    title: apiData.title,
    description: apiData.overview,
    backdrop: `https://image.tmdb.org/t/p/original${apiData.backdrop_path}`,
    poster: `https://image.tmdb.org/t/p/w500${apiData.poster_path}`,
    year: apiData.release_date.split('-')[0],
    rating: parseFloat(apiData.vote_average.toFixed(2)),
    genres: categorias,
    actors: actores,
    director: nombreDirector,
    producers: productores,
    recommendations: peliculasRecomendadas,
    cast: reparto,
    reviews: apiData.reviews.results
      .slice(0, 2)
      .map(review => ({
        author: review.author,
        content: review.content || review.text,
        // Aseguramos que el contenido no sea demasiado largo
        content: review.content && review.content.length > 400 ? review.content.substring(0, 800) + '...' : review.content || review.text,
        authordetails: review.author_details && review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author || 'U')}&background=random&color=fff`,
      })),
    trailerKey: trailerVideo ? trailerVideo.key : null,
  }
}


//Obtener peliculas formateadas
export async function getMovies(type = 'popular') {
  try {
    const url = `${BASE_URL}/movie/${type}?api_key=${API_KEY}&language=${LANGUAGE}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al obtener las peliculas");
    }

    const data = await response.json();

    const peliculasLimpias = data.results.map(movie => formatMovie(movie));

    return peliculasLimpias

  } catch (error) {
    console.error("Error en getMovies:", error);
    return [];
  }

};

//obtener data de peliculas
export async function getMovieDetails(id) {
  try {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${LANGUAGE}&append_to_response=credits,recommendations,reviews,videos`;
    const response = await fetch(url);


    if (!response.ok) {
      throw new Error(`Error al obtener los detalles de la pelicula ${id}`);
    }

    const data = await response.json();
    console.log("Datos crudos de la API:", data);
    return formatMovieDetails(data);

  } catch (error) {
    console.error("Error en getMovieDetails:", error);
    return null;
  }
}