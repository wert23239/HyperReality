const LAST_RESULT_STORAGE_KEY = "hr-last-result";

export function rememberLastResult(code: string, readerName: string) {
  let updatedAt = new Date().toISOString();

  // An unreadable or malformed old entry must not prevent saving a new book.
  try {
    const previous = JSON.parse(localStorage.getItem(LAST_RESULT_STORAGE_KEY) ?? "null");
    const previousName = typeof previous?.readerName === "string"
      ? previous.readerName.replace(/\s+/g, " ").trim().slice(0, 60)
      : "";
    if (previous?.code === code && previousName === readerName &&
        typeof previous.updatedAt === "string" && Number.isFinite(Date.parse(previous.updatedAt))) {
      updatedAt = previous.updatedAt;
    }
  } catch {}

  try {
    localStorage.setItem(LAST_RESULT_STORAGE_KEY, JSON.stringify({ code, readerName, updatedAt }));
  } catch {
    // Remembering a book is best-effort when storage is unavailable or full.
  }
}
