import { FileRoute, defer, Await } from "@tanstack/react-router";
import * as React from "react";

import MovieCards from "../components/MovieCards";
import Movie from "../components/Movie";

interface SearchParams {
  q: string;
}

function fetchMovies(query: string = "") {
  const isServer = typeof window === "undefined";
  return fetch(
    `${
      isServer ? "http://localhost:3000" : ""
    }/api/search?query=${encodeURIComponent(query)}`
  ).then((r) => r.json());
}

async function fetchMovie(id: string) {
  const isServer = typeof window === "undefined";
  await new Promise((r) => setTimeout(r, 3000));
  return fetch(
    `${isServer ? "http://localhost:3000" : ""}/api/movie/${encodeURIComponent(
      id
    )}`
  ).then((r) => r.json());
}

export const Route = new FileRoute('/search/').createRoute({
  component: SearchRoute,
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    const movies = await fetchMovies(q);
    return {
      movies,
      firstMovie: movies?.[0]?.id ? defer(fetchMovie(movies[0].id)) : null,
    };
  },
  validateSearch: (search: { q: string }): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
});

function SearchRoute() {
  const { movies, firstMovie } = Route.useLoaderData();

  return (
    <>
      {firstMovie && (
        <div className="my-5">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Await promise={firstMovie}>
              {(movie) => {
                return <Movie movie={movie} />;
              }}
            </Await>
          </React.Suspense>
        </div>
      )}

      <MovieCards movies={movies || []} />
    </>
  );
}
