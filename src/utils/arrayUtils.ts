/**
 * Safely extracts an array from any API response structure.
 * Handles direct arrays, Spring Data Page objects (content), wrapper objects (data, items, result),
 * and returns an empty array [] if the input is null, undefined, or empty object.
 */
export function ensureArray<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.resultados)) return data.resultados;
  return [];
}
