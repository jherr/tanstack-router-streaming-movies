import express from "express";
import getPort, { portNumbers } from "get-port";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) {
  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import("compression")).default());
  }

  app.use("/api/movies", async (req, res) => {
    const page = req.query.page || 1;
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/popular?include_adult=false&language=en-US&page=${page}&api_key=${process.env.TMDB_API_KEY}`
    )
      .then((r) => r.json())
      .then((r) => ({
        pages: 3,
        movies: r.results,
      }));
    res.json(data);
  });

  app.use("/api/movie/:id", async (req, res) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${req.params.id}?language=en-US&api_key=${process.env.TMDB_API_KEY}`
    ).then((r) => r.json());
    res.json(data);
  });

  app.use("/api/search", async (req, res) => {
    const query = req.query.query || "";
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1&api_key=${
        process.env.TMDB_API_KEY
      }`
    )
      .then((r) => r.json())
      .then((r) => r.results);
    res.json(data);
  });

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      if (url.includes(".")) {
        console.warn(`${url} is not valid router path`);
        res.status(404);
        res.end(`${url} is not valid router path`);
        return;
      }

      // Extract the head from vite's index transformation hook
      let viteHead = !isProd
        ? await vite.transformIndexHtml(
            url,
            `<html><head></head><body></body></html>`
          )
        : "";

      viteHead = viteHead.substring(
        viteHead.indexOf("<head>") + 6,
        viteHead.indexOf("</head>")
      );

      const entry = await (async () => {
        if (!isProd) {
          return vite.ssrLoadModule("/src/entry-server.tsx");
        } else {
          return import("./dist/server/entry-server.tsx");
        }
      })();

      console.log("Rendering: ", url, "...");
      entry.render({ req, res, url, head: viteHead });
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(async ({ app }) =>
    app.listen(await getPort({ port: portNumbers(3000, 3100) }), () => {
      console.log("Client Server: http://localhost:3000");
    })
  );
}
