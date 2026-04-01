export function formatNoteDate(iso: string): string {
  if (!iso) return '';

  const date = new Date(iso);

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}