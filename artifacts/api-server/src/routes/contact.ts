import { Router, Request, Response } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

// POST /api/contact
router.post("/", async (req: Request, res: Response) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed" });
    return;
  }

  try {
    await db.insert(contactsTable).values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message,
    });

    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    req.log.error({ err }, "Failed to save contact message");
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
