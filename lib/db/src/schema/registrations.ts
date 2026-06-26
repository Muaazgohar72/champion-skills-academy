import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const registrationsTable = pgTable("registrations", {
  id: serial("id").primaryKey(),
  // Player Information
  playerFirstName: text("player_first_name").notNull(),
  playerLastName: text("player_last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  school: text("school").notNull(),
  grade: text("grade").notNull(),
  shirtSize: text("shirt_size").notNull(),
  // Parent / Guardian
  parentName: text("parent_name").notNull(),
  parentRelationship: text("parent_relationship").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email").notNull(),
  hearAboutUs: text("hear_about_us").notNull(),
  // Emergency Contacts
  emergencyContact1Name: text("emergency_contact1_name").notNull(),
  emergencyContact1Relationship: text("emergency_contact1_relationship").notNull(),
  emergencyContact1Phone: text("emergency_contact1_phone").notNull(),
  emergencyContact2Name: text("emergency_contact2_name"),
  emergencyContact2Relationship: text("emergency_contact2_relationship"),
  emergencyContact2Phone: text("emergency_contact2_phone"),
  // Medical Information
  hasMedicalConditions: boolean("has_medical_conditions").notNull(),
  medicalConditionsExplain: text("medical_conditions_explain"),
  takesMedication: boolean("takes_medication").notNull(),
  medicationList: text("medication_list"),
  allergies: text("allergies"),
  medicalNotes: text("medical_notes"),
  // Liability Waiver
  liabilityAgreed: boolean("liability_agreed").notNull(),
  liabilitySignature: text("liability_signature").notNull(),
  liabilityDate: text("liability_date").notNull(),
  // Attendance Agreement
  attendanceAgreed: boolean("attendance_agreed").notNull(),
  attendanceSignature: text("attendance_signature").notNull(),
  attendanceDate: text("attendance_date").notNull(),
  // Parent Code of Conduct
  parentConductAgreed: boolean("parent_conduct_agreed").notNull(),
  parentConductSignature: text("parent_conduct_signature").notNull(),
  parentConductDate: text("parent_conduct_date").notNull(),
  // Player Code of Conduct
  playerConductAgreed: boolean("player_conduct_agreed").notNull(),
  playerConductSignature: text("player_conduct_signature").notNull(),
  playerConductDate: text("player_conduct_date").notNull(),
  // Photo Release
  photoReleaseGranted: boolean("photo_release_granted").notNull(),
  photoReleaseParentName: text("photo_release_parent_name").notNull(),
  photoReleaseSignature: text("photo_release_signature").notNull(),
  photoReleaseDate: text("photo_release_date").notNull(),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRegistrationSchema = createInsertSchema(registrationsTable).omit({ id: true, createdAt: true });
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrationsTable.$inferSelect;
