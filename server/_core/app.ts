import "dotenv/config";
import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./staticServe";

/**
 * Builds the Express app with all API routes registered, but does NOT call
 * app.listen(). This lets the same app be:
 *  - wrapped with an http.Server + Vite dev middleware for local development
 *  - exported directly as a Vercel serverless function (api/index.ts)
 */
export function createApp(): Express {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  return app;
}

/**
 * For non-dev, non-Vercel usage (e.g. `npm start` on a normal Node host),
 * this also mounts the built static client files. On Vercel, static files
 * are served by the platform directly from dist/public, so this is skipped
 * there (see api/index.ts).
 */
export function createAppWithStatic(): Express {
  const app = createApp();
  serveStatic(app);
  return app;
}
