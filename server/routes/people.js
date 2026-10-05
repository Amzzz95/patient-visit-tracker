import { Router } from "express";
import db from "../db.js";
import { sanitizeText, parseOptionalDate } from "../utils/validation.js";

function notFound(res, table) {
  return res.status(404).json({ error: `${table.slice(0, -1)} not found.` });
}

export function createPeopleRouter() {
  const router = Router();

  const configs = [
    { table: "clinicians", extraField: "specialty" },
    { table: "patients", extraField: "date_of_birth" },
  ];

  for (const { table, extraField } of configs) {
    router.get(`/api/${table}`, (_req, res) => {
      try {
        const rows = db.prepare(`SELECT * FROM ${table} ORDER BY name COLLATE NOCASE ASC`).all();
        res.json(rows);
      } catch (error) {
        console.error(`GET /api/${table} failed`, error);
        res.status(500).json({ error: "Failed to fetch records." });
      }
    });

    router.post(`/api/${table}`, (req, res) => {
      try {
        const name = sanitizeText(req.body?.name, { maxLength: 200 });

        if (!name) {
          return res.status(400).json({ error: "Name is required." });
        }

        let extraValue = sanitizeText(req.body?.[extraField], {
          allowEmpty: true,
          maxLength: 200,
        });

        if (extraField === "date_of_birth") {
          extraValue = parseOptionalDate(extraValue, "date of birth");
        }

        const info = db
          .prepare(`INSERT INTO ${table} (name, ${extraField}) VALUES (?, ?)`)
          .run(name, extraValue);

        const created = db
          .prepare(`SELECT * FROM ${table} WHERE id = ?`)
          .get(info.lastInsertRowid);

        if (!created) {
          return notFound(res, table);
        }

        return res.status(201).json(created);
      } catch (error) {
        console.error(`POST /api/${table} failed`, error);

        return res.status(400).json({
          error: error.message || `Failed to create ${table.slice(0, -1)}.`,
        });
      }
    });
  }

  return router;
}
