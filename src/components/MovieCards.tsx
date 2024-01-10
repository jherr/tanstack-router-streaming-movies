import { Link } from "@tanstack/react-router";
import * as React from "react";

export default function IndexComponent({ movies }: { movies: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {movies.map((m, i) => (
        <Link
          to="/movies/$movieId"
          params={{
            movieId: m.id,
          }}
          className="flex m-2"
          key={m.id || i}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
            className="rounded-tl-lg rounded-bl-lg aspect-w-5 aspect-h-7 w-1/4"
          />
          <div className="w-3/4 flex flex-col">
            <div className="font-bold text-xl px-4 bg-indigo-800 text-white py-2 rounded-tr-md">
              {m.original_title}
            </div>
            <div className="border-indigo-900 border-b-2 border-r-2 rounded-br-lg flex-grow pt-3">
              <div className="italic line-clamp-2 px-4">{m.overview}</div>
              <div className="flex justify-between px-4 pt-3 items-center">
                {/* <FavoriteButton movieId={m.id} /> */}
                <div>{m.vote_average.toFixed(1)} out of 10</div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
