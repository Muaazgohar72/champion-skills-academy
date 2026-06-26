import { Router, Request, Response } from "express";
import { db, registrationsTable } from "@workspace/db";
import { count, sql } from "drizzle-orm";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD && process.env.NODE_ENV === "production") {
  throw new Error(
    "ADMIN_PASSWORD environment variable is required in production but was not provided.",
  );
}

const effectiveAdminPassword = ADMIN_PASSWORD || "champion2024";

// POST /api/admin/login
router.post("/login", async (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password || password !== effectiveAdminPassword) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session = { isAdmin: true };
  res.json({ success: true, message: "Logged in successfully" });
});

// GET /api/admin/me
router.get("/me", (req: Request, res: Response) => {
  if (req.session?.isAdmin) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// POST /api/admin/logout
router.post("/logout", (req: Request, res: Response) => {
  req.session = null;
  res.json({ success: true, message: "Logged out" });
});

// GET /api/admin/stats
router.get("/stats", async (req: Request, res: Response) => {
  if (!req.session?.isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [totalResult] = await db
      .select({ count: count() })
      .from(registrationsTable);

    const [monthResult] = await db
      .select({ count: count() })
      .from(registrationsTable)
      .where(sql`${registrationsTable.createdAt} >= ${startOfMonth}`);

    const [weekResult] = await db
      .select({ count: count() })
      .from(registrationsTable)
      .where(sql`${registrationsTable.createdAt} >= ${startOfWeek}`);

    const [maleResult] = await db
      .select({ count: count() })
      .from(registrationsTable)
      .where(sql`${registrationsTable.gender} = 'male'`);

    const [femaleResult] = await db
      .select({ count: count() })
      .from(registrationsTable)
      .where(sql`${registrationsTable.gender} = 'female'`);

    res.json({
      total: totalResult.count,
      thisMonth: monthResult.count,
      thisWeek: weekResult.count,
      byGender: {
        male: maleResult.count,
        female: femaleResult.count,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
