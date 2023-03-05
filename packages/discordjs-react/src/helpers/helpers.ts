export function omit<Subject extends object, Key extends PropertyKey>(
  subject: Subject,
  keys: Key[],
  // hack: using a conditional type preserves union types
): Subject extends any ? Omit<Subject, Key> : never {
  const result: any = {}
  for (const key in subject) {
    if (!keys.includes(key as unknown as Key)) {
      result[key] = subject[key]
    }
  }
  return result
}


export function toError(value: unknown) {
  return value instanceof Error ? value : new Error(String(value))
}
export function raise(error: unknown): never {
  throw toError(error)
}

export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

export const isInstanceOf =
  <T>(Constructor: new (...args: any[]) => T) =>
  (value: unknown): value is T =>
    value instanceof Constructor