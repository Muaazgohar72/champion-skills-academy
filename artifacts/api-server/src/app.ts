import express, { type Express } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

declare module "express" {
  interface Request {
    session: { isAdmin?: boolean } | null;
  }
}

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Comma-separated list of allowed frontend origins, e.g.
// "https://championskillsacademy.netlify.app,http://localhost:5173"
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "https://championskillsacademy.netlify.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

if (!process.env.SESSION_SECRET) {
  // Fail loudly in production rather than silently signing sessions with a
  // public, guessable secret that anyone with this codebase could forge.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET environment variable is required in production but was not provided.",
    );
  }
  logger.warn(
    "SESSION_SECRET is not set. Using an insecure development-only fallback secret.",
  );
}

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cookieSession({
    name: "csa_session",
    secret: process.env.SESSION_SECRET || "dev-only-insecure-secret",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // Netlify (frontend) and Render (backend) are different domains, so the
    // session cookie must be sent cross-site. That requires SameSite=None,
    // which browsers only honor when the cookie is also Secure (HTTPS).
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    httpOnly: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
