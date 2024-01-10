import { FileRoute, useNavigate, Outlet } from "@tanstack/react-router";
import * as React from "react";

interface SearchParams {
  q: string;
}

export const Route = new FileRoute('/search').createRoute({
  component: SearchRoute,
  validateSearch: (search: { q: string }): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
});

function SearchRoute() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });
  const [newQuery, setNewQuery] = React.useState(q);

  return (
    <div className="p-2">
      <div className="flex gap-2">
        <input
          value={newQuery}
          onChange={(e) => {
            setNewQuery(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              navigate({
                search: (old: { q: string }) => ({
                  ...old,
                  q: newQuery,
                }),
              });
            }
          }}
          className="border-2 border-gray-300 rounded-md p-1 text-black w-full"
        />
        <button
          onClick={() => {
            navigate({
              search: (old: { q: string }) => ({
                ...old,
                q: newQuery,
              }),
            });
          }}
        >
          Search
        </button>
      </div>
      <Outlet />
    </div>
  );
}
