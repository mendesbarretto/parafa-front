export function paginatedCanonical(path: string, requestedPage?: string): string {
  const page = Number(requestedPage);
  return Number.isSafeInteger(page) && page > 1 ? `${path}?page=${page}` : path;
}
