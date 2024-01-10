import * as React from "react";

import type { Movie } from "../types";

export default function Movie({ movie }: { movie: Movie }) {
  return (
    <div className="flex">
      <div className="flex-shrink w-1/4">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          className="aspect-w-5 aspect-h-7 rounded-3xl"
        />
      </div>
      <div className="w-3/4">
        <div className="font-bold text-2xl px-4">{movie.title}</div>
        <div className="italic text-xl px-4 mb-5">{movie.tagline}</div>
        <div className="pt-3 px-4">
          <div className="italic">{movie.overview}</div>
          <div className="flex justify-between pt-3 items-center">
            <div>{movie.vote_average.toFixed(1)} out of 10</div>
          </div>
          <div className="grid grid-cols-[30%_70%] pt-3 gap-3">
            <div className="font-bold text-right">Runtime</div>
            <div>{movie.runtime} minutes</div>

            <div className="font-bold text-right">Genres</div>
            <div>{movie.genres.map(({ name }) => name).join(", ")}</div>

            <div className="font-bold text-right">Release Date</div>
            <div>{movie.release_date}</div>

            <div className="font-bold text-right">Production Companies</div>
            <div>
              {movie.production_companies.map(({ name }) => name).join(", ")}
            </div>

            <div className="font-bold text-right">Languages</div>
            <div>
              {movie.spoken_languages
                .map(({ english_name }) => english_name)
                .join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
