const capitalize = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const normalizeDayPeriod = (value) => value.replace(/\s/g, '').toLowerCase();

export function formatMenuBarDateTime(date = new Date(), timeZone = undefined) {
  const formatterOptions = { timeZone };

  const weekday = capitalize(new Intl.DateTimeFormat('es-MX', {
    weekday: 'short',
    ...formatterOptions,
  }).format(date).replace('.', ''));

  const day = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    ...formatterOptions,
  }).format(date);

  const month = new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    ...formatterOptions,
  }).format(date).replace('.', '').toLowerCase();

  const timeParts = new Intl.DateTimeFormat('es-MX', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    ...formatterOptions,
  }).formatToParts(date);

  const pickPart = (type) => timeParts.find((part) => part.type === type)?.value ?? '';

  const hour = pickPart('hour');
  const minute = pickPart('minute');
  const second = pickPart('second');
  const dayPeriod = normalizeDayPeriod(pickPart('dayPeriod'));

  return `${weekday} ${day} de ${month} ${hour}:${minute}:${second} ${dayPeriod}`;
}
