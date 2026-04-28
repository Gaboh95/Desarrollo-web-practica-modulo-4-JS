const API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'es-ES';

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


    const directorObj = apiData.credits.crew.find(miembro => miembro.job === 'Director');
    const nombreDirector = directorObj ? directorObj.name : 'Desconocido';


    const productores = apiData.credits.crew
      .filter(miembro => miembro.job === 'Producer')
      .map(prod => prod.name)
      .join(', ');

    const categorias = apiData.genres.map(g => g.name).join(', ');

    const peliculasRecomendadas = apiData.recommendations.results
      .slice(0, 4)
      .map(peli => formatMovie(peli));


    return {
        id: apiData.id,
        title: apiData.title,
        description: apiData.overview,
        poster: `https://image.tmdb.org/t/p/w500${apiData.poster_path}`,
        year: apiData.release_date.split('-')[0],
        rating: parseFloat(apiData.vote_average.toFixed(2)),
        genres: categorias,
        actors: actores,
        director: nombreDirector,
        producers: productores,
        recommendations: peliculasRecomendadas,
    }
}


//Obtener peliculas formateadas
export async function getMovies(type = 'popular') {
    try{
        const url = `${BASE_URL}/movie/${type}?api_key=${API_KEY}&language=${LANGUAGE}`;
        const response = await fetch(url);

        if (!response.ok){
            throw new Error("Error al obtener las peliculas");
        }

        const data = await response.json();

        const peliculasLimpias = data.results.map(movie => formatMovie(movie));
        
        return peliculasLimpias

    } catch (error){
        console.error("Error en getMovies:", error);
        return [];
    }
    
};

//obtener data de peliculas
export async function getMovieDetails(id) {
    try {
        const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language${LANGUAGE}&append_to_response=credits,recommendations`;
        const response = await fetch(url);
    

    if(!response.ok){
        throw new Error(`Error al obtener los detalles de la pelicula ${id}`);
    }

    const data = await response.json();
    return formatMovieDetails(data);

    } catch (error){
        console.error("Error en getMovieDetails:", error);
        return null;
    }
}