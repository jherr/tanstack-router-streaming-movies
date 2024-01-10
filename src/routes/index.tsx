import { Link, FileRoute } from "@tanstack/react-router";
import * as React from "react";
import { z } from "zod";

import MovieCards from "../components/MovieCards";

interface SearchParams {
  page: number;
}

function fetchMovies(page: number = 1) {
  const isServer = typeof window === "undefined";
  return fetch(
    `${
      isServer ? "http://localhost:3000" : ""
    }/api/movies?page=${encodeURIComponent(page)}`
  ).then((r) => r.json());
}

export const Route = new FileRoute('/').createRoute({
  component: IndexComponent,
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ deps: { page } }) => fetchMovies(page),
  validateSearch: z.object({
    page: z.number().catch(1),
  }),
});

function IndexComponent() {
  const { movies, pages } = Route.useLoaderData();
  const { page } = Route.useSearch();

  return (
    <div>
      <div className="flex justify-end pr-5 py-5">
        <div className="flex gap-1 text-xl font-bold justify-end">
          {new Array(pages).fill(0).map((_, i) =>
            page === i + 1 ? (
              <div className="px-4 py-2 border border-gray-300 rounded bg-indigo-800 text-white">
                {i + 1}
              </div>
            ) : (
              <Link
                key={i}
                from={Route.id}
                search={{
                  page: i + 1,
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-indigo-200"
              >
                {i + 1}
              </Link>
            )
          )}
        </div>
      </div>
      <MovieCards movies={movies} />
    </div>
  );
}
