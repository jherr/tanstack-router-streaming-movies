import { Link, FileRoute } from "@tanstack/react-router";
import * as React from "react";

import MovieCards from "../components/MovieCards";

interface SearchParams {
  page: number;
}

function fetchMovies(page: number = 1) {
  console.log(`fetching page ${page}`);
  return fetch(
    `https://api.themoviedb.org/3/movie/popular?include_adult=false&language=en-US&page=${page}&api_key=${process.env.TMDB_API_KEY}`
  )
    .then((r) => r.json())
    .then((r) => ({
      pages: 3,
      movies: r.results,
    }));
}

export const Route = new FileRoute('/popular').createRoute({
  component: PopularComponent,
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ deps: { page } }) => fetchMovies(page),
  validateSearch: (search: { page: number }): SearchParams => {
    return {
      page: +(search.page as number) || 1,
    };
  },
});

function PopularComponent() {
  const { movies, pages } = Route.useLoaderData();

  return (
    <div>
      <div className="flex justify-end pr-5 py-5">
        <div className="flex gap-1 text-xl font-bold justify-end">
          {new Array(pages).fill(0).map((_, i) => (
            <Link
              key={i}
              from={Route.id}
              search={(prev) => ({
                ...prev,
                page: i + 1,
              })}
              activeProps={{
                className: "bg-indigo-800 text-white",
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-indigo-200"
            >
              {i + 1}
            </Link>
          ))}
        </div>
      </div>
      <MovieCards movies={movies} />
    </div>
  );
}
