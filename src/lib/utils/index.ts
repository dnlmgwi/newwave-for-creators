

function parseEnum<T extends { [key: string]: string }>(
  enumType: T,
  value: string
): T[keyof T] | null {
  const values = Object.values(enumType) as string[];
  if (values.includes(value)) {
    return value as T[keyof T];
  }
  return null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export { getErrorMessage, parseEnum };
