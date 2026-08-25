export function debounce<TArgs extends unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  delay = 500,
) {
  let inDebounce: ReturnType<typeof setTimeout> | undefined;

  return function (this: unknown, ...args: TArgs): void {
    if (inDebounce) clearTimeout(inDebounce);
    inDebounce = setTimeout(
      () => func.apply(this, args),
      delay,
    );
  };
}
