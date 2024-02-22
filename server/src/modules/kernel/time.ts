export function getTomorrow() {
  const tomorrow = new Date(Date.now());

  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.getTime();
}
