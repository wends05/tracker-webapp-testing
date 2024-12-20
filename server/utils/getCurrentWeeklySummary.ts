import { Pool } from "pg";
import getLastSunday from "./getLastSunday";
import { WeeklySummary } from "./types";

export default async function getCurrentWeeklySummary({
  pool,
}: {
  pool: Pool;
}) {
  const sunday = getLastSunday();

  const { rows: weeklySummaryRow } = await pool.query<WeeklySummary>(
    'SELECT * FROM "Weekly Summary" WHERE date_start = $1',
    [sunday]
  );

  return weeklySummaryRow[0];
}
