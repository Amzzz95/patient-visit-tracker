import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "./index.js";

test("GET /api/clinicians returns empty array initially", async () => {
  const res = await request(app).get("/api/clinicians");
  assert.equal(res.status, 200);
  assert.equal(Array.isArray(res.body), true);
});

test("POST /api/clinicians creates a new clinician", async () => {
  const res = await request(app)
    .post("/api/clinicians")
    .send({ name: "Dr Alice", specialty: "Surgery" });
  assert.equal(res.status, 201);
  assert.equal(res.body.name, "Dr Alice");
  assert.equal(res.body.specialty, "Surgery");
});

test("POST /api/clinicians rejects missing name", async () => {
  const res = await request(app)
    .post("/api/clinicians")
    .send({ specialty: "Surgery" });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /required/i);
});

test("POST /api/patients creates a new patient", async () => {
  const res = await request(app)
    .post("/api/patients")
    .send({ name: "John Doe" });
  assert.equal(res.status, 201);
  assert.equal(res.body.name, "John Doe");
});

test("POST /api/visits requires valid clinician and patient", async () => {
  const res = await request(app)
    .post("/api/visits")
    .send({
      clinicianId: 999,
      patientId: 999,
      visitedAt: new Date().toISOString(),
    });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /not found/i);
});

test("POST /api/visits rejects invalid date", async () => {
  const res = await request(app)
    .post("/api/visits")
    .send({
      clinicianId: 1,
      patientId: 1,
      visitedAt: "not-a-date",
    });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /valid.*date/i);
});

test("GET /api/visits returns visits newest first", async () => {
  // Setup: create clinician and patient
  const doc = await request(app)
    .post("/api/clinicians")
    .send({ name: "Dr Bob" });
  const pat = await request(app)
    .post("/api/patients")
    .send({ name: "Jane Doe" });

  // Create two visits
  await request(app)
    .post("/api/visits")
    .send({
      clinicianId: doc.body.id,
      patientId: pat.body.id,
      visitedAt: "2026-09-01T10:00",
      notes: "First visit",
    });

  await request(app)
    .post("/api/visits")
    .send({
      clinicianId: doc.body.id,
      patientId: pat.body.id,
      visitedAt: "2026-09-02T14:00",
      notes: "Second visit",
    });

  const res = await request(app).get("/api/visits");
  assert.equal(res.status, 200);
  assert.equal(res.body.length >= 2, true);
  // Newest first
  assert.match(res.body[0].visited_at, /2026-09-02/);
});

test("GET /api/visits filters by clinicianId", async () => {
  const doc = await request(app)
    .post("/api/clinicians")
    .send({ name: "Dr Charlie" });
  const pat = await request(app)
    .post("/api/patients")
    .send({ name: "Patient Z" });

  await request(app)
    .post("/api/visits")
    .send({
      clinicianId: doc.body.id,
      patientId: pat.body.id,
      visitedAt: new Date().toISOString(),
    });

  const res = await request(app).get(`/api/visits?clinicianId=${doc.body.id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.length > 0, true);
  res.body.forEach((v) => {
    assert.equal(v.clinician_id, doc.body.id);
  });
});
