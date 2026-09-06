import { createApp } from "../server/_core/app";

// Vercel's Node runtime accepts an Express app (or any (req, res) handler)
// as a serverless function directly -- do NOT call app.listen() here.
// Static assets (dist/public) are served by Vercel's CDN based on
// vercel.json's outputDirectory; this function only ever sees requests
// that vercel.json rewrites to it (/api/*, /manus-storage/*).
const app = createApp();

export default app;
