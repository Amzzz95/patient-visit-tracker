const toLocalDateTimeValue = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

export function sanitizeText(value, { allowEmpty = false, maxLength = 500 } = {}) {
  if (typeof value !== "string") {
    return allowEmpty ? "" : null;
  }

  const trimmed = value.trim();

  if (!trimmed && allowEmpty) {
    return "";
  }

  if (!trimmed) {
    return null;
  }

  if (trimmed.length > maxLength) {
    return trimmed.slice(0, maxLength);
  }

  return trimmed;
}

export function parsePositiveInt(value, fieldName) {
  const num = Number(value);

  if (!Number.isInteger(num) || num <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  return num;
}

export function parseOptionalDate(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalizedValue = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalizedValue)) {
    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
      throw new Error(`Enter a valid ${fieldName}.`);
    }

    return toLocalDateTimeValue(date);
  }

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Enter a valid ${fieldName}.`);
  }

  return toLocalDateTimeValue(date);
}
