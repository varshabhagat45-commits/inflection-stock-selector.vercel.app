import express, { type Express } from "express";
import fs from "fs";
import path from "path";

// Serves the pre-built client bundle. Deliberately has NO import of the
// "vite" package (a devDependency) so that files importing only this
// module -- like the Vercel serverless entrypoint -- don't drag the Vite
// dev server into the production function bundle.
export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
