import { FileRoute, lazyFn, lazyRouteComponent } from "@tanstack/react-router"

import { Route as rootRoute } from "./routes/__root"
import { Route as SearchImport } from "./routes/search"
import { Route as IndexImport } from "./routes/index"
import { Route as MoviesMovieIdImport } from "./routes/movies/$movieId"
import { Route as SearchIndexImport } from "./routes/search.index"

const SearchRoute = SearchImport.update({
  path: "/search",
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const MoviesMovieIdRoute = MoviesMovieIdImport.update({
  path: "/movies/$movieId",
  getParentRoute: () => rootRoute,
} as any)

const SearchIndexRoute = SearchIndexImport.update({
  path: "/",
  getParentRoute: () => SearchRoute,
} as any)

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/search": {
      preLoaderRoute: typeof SearchImport
      parentRoute: typeof rootRoute
    }
    "/search/": {
      preLoaderRoute: typeof SearchIndexImport
      parentRoute: typeof SearchRoute
    }
    "/movies/$movieId": {
      preLoaderRoute: typeof MoviesMovieIdImport
      parentRoute: typeof rootRoute
    }
  }
}

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  SearchRoute.addChildren([SearchIndexRoute]),
  MoviesMovieIdRoute,
])
