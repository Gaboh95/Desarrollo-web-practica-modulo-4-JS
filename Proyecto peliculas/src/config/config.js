export const MovieListType = Object.freeze({
  nowPlaying: "now_playing",
  popular: "popular",
  topRated: "top_rated",
  upcoming: "upcoming",
});

export const globalConfig = {
  notAvailableValue: "(No disponible)",
  defaultMovieListType: MovieListType.nowPlaying,
};

export const apiConfig = {
  apiKey: "15d2ea6d0dc1d476efbca3eba2b9bbfb",
  langIso: "es-ES",
  baseUrl: "https://api.themoviedb.org/3/",
  posterBaseUrl: "http://image.tmdb.org/t/p",
  backdropBaseUrl: "https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces",
};
