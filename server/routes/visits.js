import { Router } from "express";
import db from "../db.js";
import { parseOptionalDate, parsePositiveInt, sanitizeText } from "../utils/validation.js";

const VISIT_SELECT = `
  SELECT v.id, v.visited_at, v.notes,
         v.clinician_id, c.name AS clinician_name,
         v.patient_id, p.name AS patient_name
  FROM visits v
  JOIN clinicians c ON c.id = v.clinician_id
  JOIN patients p ON p.id = v.patient_id`;

export function createVisitsRouter() {
  const router = Router();

  router.get("/api/visits", (req, res) => {
    try {
      const where = [];
      const args = [];

      if (req.query.clinicianId) {
        where.push("v.clinician_id = ?");
        args.push(parsePositiveInt(req.query.clinicianId, "clinicianId"));
      }

      if (req.query.patientId) {
        where.push("v.patient_id = ?");
        args.push(parsePositiveInt(req.query.patientId, "patientId"));
      }

      const sql = `
        ${VISIT_SELECT}
        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        ORDER BY v.visited_at DESC, v.id DESC
      `;

      const rows = db.prepare(sql).all(...args);
      return res.json(rows);
    } catch (error) {
      console.error("GET /api/visits failed", error);
      return res.status(400).json({ error: error.message || "Failed to fetch visits." });
    }
  });

  router.post("/api/visits", (req, res) => {
    try {
      const clinicianId = parsePositiveInt(req.body?.clinicianId, "clinicianId");
      const patientId = parsePositiveInt(req.body?.patientId, "patientId");
      const visitedAt = parseOptionalDate(req.body?.visitedAt, "visit date and time");
      const notes = sanitizeText(req.body?.notes, { allowEmpty: true, maxLength: 2000 });

      if (!clinicianId || !patientId) {
        return res.status(400).json({ error: "Choose a clinician and a patient." });
      }

      const clinicianExists = db
        .prepare("SELECT 1 FROM clinicians WHERE id = ?")
        .get(clinicianId);

      const patientExists = db
        .prepare("SELECT 1 FROM patients WHERE id = ?")
        .get(patientId);

      if (!clinicianExists || !patientExists) {
        return res.status(400).json({ error: "Clinician or patient not found." });
      }

      const info = db
        .prepare(
          "INSERT INTO visits (clinician_id, patient_id, visited_at, notes) VALUES (?, ?, ?, ?)"
        )
        .run(clinicianId, patientId, visitedAt, notes);

      const createdVisit = db.prepare(`${VISIT_SELECT} WHERE v.id = ?`).get(info.lastInsertRowid);

      return res.status(201).json(createdVisit);
    } catch (error) {
      console.error("POST /api/visits failed", error);
      return res.status(400).json({ error: error.message || "Failed to create visit." });
    }
  });

  return router;
}
