/// https://api.themoviedb.org/3/movie/movie_id?language=en-US
import { FileRoute } from "@tanstack/react-router";
import * as React from "react";

import Movie from "../../components/Movie";

function fetchMovie(id: string) {
  const isServer = typeof window === "undefined";
  return fetch(
    `${isServer ? "http://localhost:3000" : ""}/api/movie/${encodeURIComponent(
      id
    )}`
  ).then((r) => r.json());
}

export const Route = new FileRoute('/movies/$movieId').createRoute({
  component: SearchRoute,
  loader: ({ params: { movieId } }) => fetchMovie(movieId),
});

function SearchRoute() {
  const movie = Route.useLoaderData();

  return <Movie movie={movie} />;
}
