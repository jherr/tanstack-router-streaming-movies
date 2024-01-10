import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import * as React from "react";
import { Link, Outlet, rootRouteWithContext } from "@tanstack/react-router";
import { DehydrateRouter } from "@tanstack/react-router-server/client";

import { RouterContext } from "../routerContext";

export const Route = rootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
        <link rel="stylesheet" href="/tailwind.css" />
        <script
          type="module"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              import RefreshRuntime from "/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window)
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
              window.__vite_plugin_react_preamble_installed__ = true
            `,
          }}
        />
        <script type="module" src="/@vite/client" />
        <script type="module" src="/src/entry-client.tsx" />
      </head>
      <body className="bg-black max-w-4xl mx-auto text-white px-5 md:px-0">
        <header className="flex justify-between items-center p-4 bg-indigo-950 text-white rounded-b-2xl shadow-xl shadow-blue-600 mb-6">
          <h1 className="text-2xl flex">
            <Link
              to="/"
              search={{ page: 1 }}
              activeProps={{
                className: "font-bold hello",
              }}
              activeOptions={{
                includeSearch: false,
              }}
            >
              Movies!
            </Link>
            <div className="mx-5">|</div>
            <Link
              to="/search"
              search={{ q: "" }}
              activeProps={{
                className: "font-bold",
              }}
            >
              Search
            </Link>
          </h1>
          <div id="favorites-count">{/* <FavoritesCount /> */}</div>
        </header>
        <Outlet /> {/* Start rendering router matches */}
        <TanStackRouterDevtools position="bottom-right" />
        <DehydrateRouter />
      </body>
    </html>
  );
}
