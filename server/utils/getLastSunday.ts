export default function getLastSunday() {
  const today = new Date();
  const dayToday = today.getDay();
  const sunday = new Date();
  sunday.setDate(today.getDate() - dayToday);
  sunday.setHours(0, 0, 0, 0);
  const isoLatestSunday = sunday.toISOString();
  return isoLatestSunday;
}
