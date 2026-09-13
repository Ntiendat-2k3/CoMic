type MessageValue = string | number;

/** Thay thế placeholder dạng `{name}` mà không đưa cú pháp định dạng vào component. */
export function formatMessage(
  template: string,
  values: Record<string, MessageValue>,
): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key)
      ? String(values[key])
      : placeholder,
  );
}
