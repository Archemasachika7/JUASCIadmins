/**
 * Extract the storage file path from a Supabase public URL.
 * @param url - The full public URL from Supabase storage
 * @param bucket - The storage bucket name
 * @returns The file path within the bucket, or null if extraction fails
 */
export function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/${bucket}/`;
  const index = url.lastIndexOf(marker);
  if (index === -1) return null;
  const path = url.substring(index + marker.length);
  return path || null;
}

/**
 * Format a date string or ISO timestamp for display.
 * @param dateStr - ISO date string or timestamp
 * @returns Formatted date string
 */
export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

/**
 * Format a datetime-local input value from an ISO timestamp.
 * @param dateStr - ISO timestamp
 * @returns Value suitable for datetime-local input
 */
export function toDatetimeLocal(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}
