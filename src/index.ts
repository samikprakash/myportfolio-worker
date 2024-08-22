import { fromHono } from "chanfana";
import { Hono } from "hono";
import { GetPortfolio } from "./endpoints/taskFetch";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// Register OpenAPI endpoints

app.use("*", async (c, next) => {
  await next();
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type");
});

app.options("*", (c) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type");
  return c.text("OK");
});

openapi.get("/api/myPortfolio", GetPortfolio);

app.get("/api/envTest", (c) => {
  const api = c.env.SUPABASE_API_KEY;
  const projetUrl = c.env.SUPABASE_PROJECT_URL;
  console.log("api", c.env);
  return c.json({
    success: true,
    env: api,
  });
});

// Export the Hono app
export default app;
