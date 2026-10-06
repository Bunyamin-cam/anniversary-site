import assert from "node:assert/strict";
import { test } from "node:test";
import { relationshipDuration } from "./relationship-duration.ts";

const start = "2024-02-14T00:00:00+03:00";
test("start and future dates never produce negative units", () => {
  for (const date of [start, "2023-01-01T00:00:00Z"]) assert.deepEqual(relationshipDuration(start, new Date(date)), { years: 0, months: 0, days: 0, hours: 0, minutes: 0 });
});
test("anniversary uses calendar years including leap day", () => {
  assert.deepEqual(relationshipDuration(start, new Date("2025-02-14T00:00:00+03:00")), { years: 1, months: 0, days: 0, hours: 0, minutes: 0 });
});
test("minute before anniversary retains the previous month", () => {
  assert.deepEqual(relationshipDuration(start, new Date("2025-02-13T23:59:00+03:00")), { years: 0, months: 11, days: 30, hours: 23, minutes: 59 });
});
test("calendar duration is independent of the machine timezone", () => {
  assert.deepEqual(relationshipDuration(start, new Date("2026-10-06T09:34:00Z")), { years: 2, months: 7, days: 22, hours: 12, minutes: 34 });
});
test("month end clamps to leap February and then restores original day", () => {
  const january = "2024-01-31T00:00:00+03:00";
  assert.deepEqual(relationshipDuration(january, new Date("2024-02-29T00:00:00+03:00")), { years: 0, months: 1, days: 0, hours: 0, minutes: 0 });
  assert.deepEqual(relationshipDuration(january, new Date("2024-03-31T00:00:00+03:00")), { years: 0, months: 2, days: 0, hours: 0, minutes: 0 });
});
