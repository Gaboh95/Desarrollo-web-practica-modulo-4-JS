import { apiConfig } from "../config";

export function getMoviePosterUrl(path, width = 400) {
  return `${apiConfig.posterBaseUrl}/w${width}/${path}`;
}

export function getMovieBackdropUrl(path) {
  return `${apiConfig.backdropBaseUrl}${path}`;
}

export function getMovieListUrl(movieListType, page = 1) {
  let movieListUrl = apiConfig.baseUrl;
  movieListUrl += `movie/${movieListType}`;
  movieListUrl += `?language=${apiConfig.langIso}`;
  movieListUrl += `&api_key=${apiConfig.apiKey}`;
  movieListUrl += `&page=${page}`;
  return movieListUrl;
}

export function getMovieDetailsUrl(movieId) {
  let movieDetailsUrl = apiConfig.baseUrl;
  movieDetailsUrl += `movie/${movieId}`;
  movieDetailsUrl += `?language=${apiConfig.langIso}`;
  movieDetailsUrl += `&api_key=${apiConfig.apiKey}`;

  return movieDetailsUrl;
}

export function getMovieSearchUrl(query, page = 1) {
  let movieSearchUrl = apiConfig.baseUrl;
  movieSearchUrl += `search/movie`;
  movieSearchUrl += `?query=${query}`;
  movieSearchUrl += `language=${apiConfig.langIso}`;
  movieSearchUrl += `&page=${page}`;
  movieSearchUrl += `&api_key=${apiConfig.apiKey}`;

  return movieSearchUrl;
}

export async function fetchMoviesData(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (data?.success === false)
    throw new Error(
      `Error: ${data?.status_message ?? "something whent wrong"}`
    );

  return data;
}
