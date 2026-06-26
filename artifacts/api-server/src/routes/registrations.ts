import { Router, Request, Response } from "express";
import { db, registrationsTable } from "@workspace/db";
import { desc, ilike, or, gte, lte, and, eq, sql } from "drizzle-orm";
import {
  SubmitRegistrationBody,
  ListRegistrationsQueryParams,
  GetRegistrationParams,
  DeleteRegistrationParams,
} from "@workspace/api-zod";

const router = Router();

// POST /api/registrations — submit registration
router.post("/", async (req: Request, res: Response) => {
  const parsed = SubmitRegistrationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;

  try {
    const [registration] = await db
      .insert(registrationsTable)
      .values({
        playerFirstName: data.playerFirstName,
        playerLastName: data.playerLastName,
        dateOfBirth: data.dateOfBirth,
        age: data.age,
        gender: data.gender,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        school: data.school,
        grade: data.grade,
        shirtSize: data.shirtSize,
        parentName: data.parentName,
        parentRelationship: data.parentRelationship,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        hearAboutUs: data.hearAboutUs,
        emergencyContact1Name: data.emergencyContact1Name,
        emergencyContact1Relationship: data.emergencyContact1Relationship,
        emergencyContact1Phone: data.emergencyContact1Phone,
        emergencyContact2Name: data.emergencyContact2Name ?? null,
        emergencyContact2Relationship: data.emergencyContact2Relationship ?? null,
        emergencyContact2Phone: data.emergencyContact2Phone ?? null,
        hasMedicalConditions: data.hasMedicalConditions,
        medicalConditionsExplain: data.medicalConditionsExplain ?? null,
        takesMedication: data.takesMedication,
        medicationList: data.medicationList ?? null,
        allergies: data.allergies ?? null,
        medicalNotes: data.medicalNotes ?? null,
        liabilityAgreed: data.liabilityAgreed,
        liabilitySignature: data.liabilitySignature,
        liabilityDate: data.liabilityDate,
        attendanceAgreed: data.attendanceAgreed,
        attendanceSignature: data.attendanceSignature,
        attendanceDate: data.attendanceDate,
        parentConductAgreed: data.parentConductAgreed,
        parentConductSignature: data.parentConductSignature,
        parentConductDate: data.parentConductDate,
        playerConductAgreed: data.playerConductAgreed,
        playerConductSignature: data.playerConductSignature,
        playerConductDate: data.playerConductDate,
        photoReleaseGranted: data.photoReleaseGranted,
        photoReleaseParentName: data.photoReleaseParentName,
        photoReleaseSignature: data.photoReleaseSignature,
        photoReleaseDate: data.photoReleaseDate,
      })
      .returning();

    res.status(201).json({
      ...registration,
      createdAt: registration.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save registration");
    res.status(500).json({ error: "Failed to save registration" });
  }
});

// GET /api/registrations — list registrations (admin)
router.get("/", async (req: Request, res: Response) => {
  if (!req.session?.isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = ListRegistrationsQueryParams.safeParse(req.query);
  const { search, dateFrom, dateTo } = parsed.success ? parsed.data : {};

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(registrationsTable.playerFirstName, `%${search}%`),
        ilike(registrationsTable.playerLastName, `%${search}%`),
        ilike(registrationsTable.parentName, `%${search}%`),
        ilike(registrationsTable.parentEmail, `%${search}%`),
      )
    );
  }

  if (dateFrom) {
    conditions.push(gte(registrationsTable.createdAt, new Date(dateFrom)));
  }

  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    conditions.push(lte(registrationsTable.createdAt, to));
  }

  try {
    const rows = await db
      .select()
      .from(registrationsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(registrationsTable.createdAt));

    res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to list registrations");
    res.status(500).json({ error: "Failed to list registrations" });
  }
});

// GET /api/registrations/:id — get single registration (admin)
router.get("/:id", async (req: Request, res: Response) => {
  if (!req.session?.isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = GetRegistrationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const [row] = await db
      .select()
      .from(registrationsTable)
      .where(eq(registrationsTable.id, parsed.data.id));

    if (!row) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }

    res.json({ ...row, createdAt: row.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get registration");
    res.status(500).json({ error: "Failed to get registration" });
  }
});

// DELETE /api/registrations/:id — delete registration (admin)
router.delete("/:id", async (req: Request, res: Response) => {
  if (!req.session?.isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = DeleteRegistrationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const deleted = await db
      .delete(registrationsTable)
      .where(eq(registrationsTable.id, parsed.data.id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }

    res.json({ success: true, message: "Registration deleted" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete registration");
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
