import { FileRoute, lazyFn, lazyRouteComponent } from "@tanstack/react-router"

import { Route as rootRoute } from "./routes/__root"
import { Route as SearchImport } from "./routes/search"
import { Route as PopularImport } from "./routes/popular"
import { Route as IndexImport } from "./routes/index"
import { Route as SearchIndexImport } from "./routes/search.index"

const SearchRoute = SearchImport.update({
  path: "/search",
  getParentRoute: () => rootRoute,
} as any)

const PopularRoute = PopularImport.update({
  path: "/popular",
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: "/",
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
    "/popular": {
      preLoaderRoute: typeof PopularImport
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
  }
}

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  PopularRoute,
  SearchRoute.addChildren([SearchIndexRoute]),
])
