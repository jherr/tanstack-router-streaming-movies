import { FileRoute } from "@tanstack/react-router";
import * as React from "react";

import MovieCards from "../components/MovieCards";

interface SearchParams {
  q: string;
}

function fetchMovies(query: string = "") {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1&api_key=${
      process.env.TMDB_API_KEY
    }`
  )
    .then((r) => r.json())
    .then((r) => r.results);
}

export const Route = new FileRoute('/search/').createRoute({
  component: SearchRoute,
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: ({ deps: { q } }) => fetchMovies(q),
  validateSearch: (search: { q: string }): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
});

function SearchRoute() {
  const movies = Route.useLoaderData();

  return <MovieCards movies={movies} />;
}
