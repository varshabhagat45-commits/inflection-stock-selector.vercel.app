import "dotenv/config";
import { createServer } from "http";
import net from "net";
import { createApp, createAppWithStatic } from "./app";
import { setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // development mode uses Vite dev middleware, production mode serves the
  // pre-built static files. This entrypoint is only used for a normal
  // persistent Node process (local dev, or `npm start` on a non-Vercel
  // host) -- Vercel uses api/index.ts instead and never calls listen().
  const isDev = process.env.NODE_ENV === "development";
  const app = isDev ? createApp() : createAppWithStatic();
  const server = createServer(app);

  if (isDev) {
    await setupVite(app, server);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
