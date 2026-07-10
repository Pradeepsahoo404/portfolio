export interface SortOptions {
  sort?: string;
  allowedFields: string[];
  defaultSort?: Record<string, 1 | -1>;
}

export function buildSort(options: SortOptions): Record<string, 1 | -1> {
  const { sort, allowedFields, defaultSort = { createdAt: -1 } } = options;

  if (!sort) return defaultSort;

  const sortObj: Record<string, 1 | -1> = {};
  const fields = sort.split(",");

  for (const field of fields) {
    const trimmed = field.trim();
    if (!trimmed) continue;

    const isDesc = trimmed.startsWith("-");
    const fieldName = isDesc ? trimmed.slice(1) : trimmed;

    if (allowedFields.includes(fieldName)) {
      sortObj[fieldName] = isDesc ? -1 : 1;
    }
  }

  return Object.keys(sortObj).length > 0 ? sortObj : defaultSort;
}
